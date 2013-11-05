class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :title
      t.integer :parent_id, null: false
      t.timestamps
    end
    add_index :entries, :parent_id
  end
end
