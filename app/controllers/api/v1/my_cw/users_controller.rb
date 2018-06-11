module Api
  module V1
    module MyCw
      class UsersController < MyCwController
        # Gets the current user
        def current
          render json: @current_user
        end

        def create
          user = ::MyCw::User.new(user_params)
          if user.save
            render json: user, serializer: Api::V1::MyCw::UserSerializer
          else
            resource_error(user)
          end
        end

        def update
          user = ::MyCw::User.find params[:id]
          if user.update(user_params)
            render json:user, serializer: Api::V1::MyCw::UserSerializer
          else
            resource_error(user)
          end
        end

        private

        def user_params
          params.require(:user).permit(:ct_id, :name, :organization)
        end
      end
    end
  end
end
