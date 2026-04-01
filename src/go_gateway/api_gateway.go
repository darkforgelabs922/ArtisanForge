package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

type GenerateRequest struct {
	Prompt string `json:"prompt"`
	Style  string `json:"style"`
}

type ProgressPayload struct {
	JobID     string `json:"job_id"`
	Progress  int    `json:"progress"`
	AgentLogs string `json:"agent_logs"`
}

var (
	telemetryHub = make(map[string]chan ProgressPayload)
	hubMutex     = sync.RWMutex{}
)

func HandleGenerate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == http.MethodOptions { return }

	var req GenerateRequest
	json.NewDecoder(r.Body).Decode(&req)
	jobID := fmt.Sprintf("job_af_%d", time.Now().UnixNano())

	hubMutex.Lock()
	telemetryHub[jobID] = make(chan ProgressPayload, 10)
	hubMutex.Unlock()

	log.Printf("[GATEWAY] New Forge Request. Job ID: %s", jobID)
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"job_id": jobID, "status": "processing"})
}

func HandleTelemetryStream(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	jobID := r.URL.Query().Get("job_id")
	hubMutex.RLock()
	jobChan, exists := telemetryHub[jobID]
	hubMutex.RUnlock()

	if !exists { http.Error(w, "Invalid job", http.StatusNotFound); return }
	flusher, _ := w.(http.Flusher)

	for {
		select {
		case payload, ok := <-jobChan:
			if !ok { return }
			dataBytes, _ := json.Marshal(payload)
			fmt.Fprintf(w, "data: %s\n\n", string(dataBytes))
			flusher.Flush()
			if payload.Progress >= 100 { return }
		case <-r.Context().Done():
			return
		}
	}
}

func HandleInternalWebhook(w http.ResponseWriter, r *http.Request) {
	var payload ProgressPayload
	json.NewDecoder(r.Body).Decode(&payload)

	hubMutex.RLock()
	jobChan, exists := telemetryHub[payload.JobID]
	hubMutex.RUnlock()

	if exists { jobChan <- payload }
	w.WriteHeader(http.StatusOK)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/v1/generate", HandleGenerate)
	mux.HandleFunc("/api/v1/telemetry", HandleTelemetryStream)
	mux.HandleFunc("/internal/webhook/progress", HandleInternalWebhook)

	log.Println("ArtisanForge Go API Gateway Online on Port 8080")
	http.ListenAndServe(":8080", mux)
}
