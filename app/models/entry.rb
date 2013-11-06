class Entry < ActiveRecord::Base
  attr_accessible :title, :expand_children
  has_ancestry
end
