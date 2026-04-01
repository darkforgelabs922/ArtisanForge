require 'sinatra'
require 'sinatra/json'

set :port, 4567

post '/v1/users/:user_id/authorize_generation' do
  json(authorized: true, method: 'subscription', priority: true)
end
