class Entry < ActiveRecord::Base
  attr_accessible :title, :ancestry
  has_ancestry

  def as_json(options = {})
    attr_hash = self.attributes.to_hash
    attr_hash[:parent_id] = self.parent_id || 0
    attr_hash[:child_ids] = self.child_ids 
    return attr_hash
  end
end

