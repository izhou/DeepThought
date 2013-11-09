class Entry < ActiveRecord::Base
  attr_accessible :title, :ancestry, :parent_id, :expanded
  has_ancestry

  def as_json(options = {})
    attr_hash = self.attributes.to_hash
    attr_hash[:parent_id] = self.parent_id || 0
    attr_hash[:child_ids] = self.child_ids 
    # attr_hash.delete("ancestry")
    return attr_hash
  end
end

