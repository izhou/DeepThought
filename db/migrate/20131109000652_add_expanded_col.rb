class AddExpandedCol < ActiveRecord::Migration
  def change
    add_column :entries, :expanded, :boolean, default:true
  end
end
