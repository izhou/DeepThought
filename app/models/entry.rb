class Entry < ActiveRecord::Base
  attr_accessible :title, :expand_children
  has_ancestry

  def as_json(options = {})
    attr_hash = self.attributes.to_hash
    attr_hash[:parent_id] = self.parent_id || 0
    attr_hash[:children] = self.children unless self.children.empty?
    return attr_hash
  end
end

