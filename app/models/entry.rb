class Entry < ActiveRecord::Base
  attr_accessible :parent_id, :title
  validates :parent_id, presence: true

  before_validation(on: :create) do
    self.parent_id ||= 0
  end

  has_many :children, class_name: "Entry", foreign_key: :parent_id
  belongs_to :parent, class_name: "Entry"
end
