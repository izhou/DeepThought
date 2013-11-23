class ChangeTitlesFromStringToText < ActiveRecord::Migration
  def up
    change_column :entries, :title, :text
  end

  def down
    change_column :entries, :title, :string
  end
end
