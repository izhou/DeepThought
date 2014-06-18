class AddDefaultValueToGuest < ActiveRecord::Migration
def up
    change_column :users, :guest, :boolean, :default => false
end

def down
    change_column :users, :guest, :boolean, :default => nil
end
end
