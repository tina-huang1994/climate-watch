class CreateEmissions < ActiveRecord::Migration[5.2]
  def change
    create_table :agriculture_profile_emissions do |t|
      t.jsonb :values, null: false

      t.timestamps

      t.references :location,
                   foreign_key: {
                       on_delete: :cascade
                   }
      t.references :emission_subcategory,
                   index: true,
                   foreign_key: { to_table: :agriculture_profile_emission_subcategories},
                   index: { name: 'index_emissions_on_emission_subcategory_id' }
    end
  end
end
