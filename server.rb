require 'sinatra'

get '/' do
  redirect 'index.html'
end

get '/one' do
  sleep(rand 5)
  '1'
end

get '/two' do
  sleep(rand 5)
  '2'
end

get '/three' do
  sleep(rand 5)
  '3'
end
