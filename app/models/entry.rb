class Entry < ActiveRecord::Base
  attr_accessible :title, :ancestry, :parent_id, :expanded, :rank, :starred, :completed
  validates_presence_of :rank
  has_ancestry
  #validates :title, :rank, presence: true
  #validates :title, :expanded, :rank, :starred, :completed, presence: true
  

  def as_json(options = {})
    attr_hash = self.attributes.to_hash
    attr_hash[:parent_id] = self.parent_id || 0
    attr_hash[:child_ids] = self.child_ids
    # attr_hash.delete("ancestry")
    return attr_hash
  end

  before_validation( on: :create) do 
    self.completed ||= false
    self.title ||= ""
    self.expanded ||= false
    self.starred ||= false
    true
  end

end
