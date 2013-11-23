class AddUsersToEntry < ActiveRecord::Migration
  def change
    add_column :entries, :user_id, :integer
    add_index :entries, :user_id
  end
end
