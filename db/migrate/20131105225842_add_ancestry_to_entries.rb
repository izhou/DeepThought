class AddAncestryToEntries < ActiveRecord::Migration
  def change
    add_index :entries, :ancestry
    remove_index :entries, :parent_id
    remove_column :entries, :parent_id
  end
end
