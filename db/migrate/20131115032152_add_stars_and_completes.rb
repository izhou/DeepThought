class AddStarsAndCompletes < ActiveRecord::Migration
  def change
    add_column :entries, :starred, :boolean, default: false
    add_column :entries, :completed, :boolean, default: false
  end
end
