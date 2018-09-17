# json.photos do
#   @photos.each do |photo|
#     json.set! photo.id do
#       json.partial! 'api/photos/photo', photo: photo
#     end
#   end
# end

# json.users do
#   @users.each do |user|
#     json.set! user.id do
#       json.extract! user, :id, :username
#     end
#   end
# end

@photos.each do |photo|
  json.set! photo.id do
    json.partial! 'photo', photo: photo
  end
end