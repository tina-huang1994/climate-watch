require 'rails_helper'

RSpec.describe Quantification::Label, type: :model do
  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:quantification_label, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when name is taken' do
    FactoryBot.create(:quantification_label, name: '2025 High pledge')
    expect(
      FactoryBot.build(:quantification_label, name: '2025 High pledge')
    ).to have(1).errors_on(:name)
  end
end
