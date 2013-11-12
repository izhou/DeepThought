class AddRankToChildren < ActiveRecord::Migration
  def change
    add_column :entries, :rank, :float
  end
end
