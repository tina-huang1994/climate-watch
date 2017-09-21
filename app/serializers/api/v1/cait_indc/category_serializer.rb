module Api
  module V1
    module CaitIndc
      class CategorySerializer < ActiveModel::Serializer
        attribute :name
        attribute :slug
        attribute :category_type, key: :type
      end
    end
  end
end
