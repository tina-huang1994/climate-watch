FactoryBot.define do
  factory :indc_indicator, class: 'Indc::Indicator' do
    name 'MyName'
    association :source, factory: :indc_source
    sequence(:slug) { |n| 'my-slug-' + ('AA'..'ZZ').to_a[n] }

    trait :with_dependants do
      transient do
        values_count 3
        labels_count 2
        sectors_count 2
        categories_count 2
      end

      after(:create) do |indicator, evaluator|
        labels = create_list(
          :indc_label,
          evaluator.labels_count,
          indicator: indicator
        )

        sector = create(
          :indc_sector,
          parent: create(:indc_sector)
        )

        indicator.categories = create_list(
          :indc_category,
          evaluator.categories_count
        )

        create_list(
          :indc_value,
          evaluator.values_count,
          indicator: indicator,
          label: labels.sample,
          sector: sector
        )
      end
    end
  end
end
