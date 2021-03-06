module NdcSdg
  class Goal < ApplicationRecord
    has_many :targets, class_name: 'NdcSdg::Target', dependent: :destroy

    validates :number, presence: true, uniqueness: true
    validates :title, presence: true
    validates :cw_title, presence: true

    def self.ndc_ids(goal_number)
      Goal.includes(targets: :ndc_targets).
        find_by!(number: goal_number).
        targets.
        flat_map(&:ndc_targets).
        map(&:ndc_id).
        uniq
    end
  end
end
