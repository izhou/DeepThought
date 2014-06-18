class UsersController < Devise::RegistrationsController
  prepend_before_filter :require_no_authentication, only: [ :new, :create, :cancel ]
  prepend_before_filter :authenticate_scope!, only: [:edit, :update, :destroy]

 def create
    if sign_up_params.empty?
      build_resource({"guest" => true, "email"=>"guest"+Time.now.to_s})
      resource_saved = resource.save(:validate => false)
    else
      build_resource(sign_up_params)
      resource_saved = resource.save
    end
        
    yield resource if block_given?
    if resource_saved
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_flashing_format?
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      respond_with resource
    end
  end

end


  # def create
  #   @user = params[:user] ? User.new(params[:user]) : User.new_guest
  #   if @user.save
  #     # current_user.move_to(@user) if current_user && current_user.guest?
  #     session[:user_id] = @user.id
  #     redirect_to root_url
  #   else
  #     render "new"
  #   end
  # end
# end
