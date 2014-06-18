class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :guest
  # attr_accessible :title, :body


  has_many :entries

  after_create :seed_entries

  def seed_entries
    home = Entry.create(title: 'Home', rank:0, user_id:self.id)
    if guest?
      home.children.create(title: 'You are a guest!', rank: 0, user_id:self.id)
    end
  end

  def self.new_guest
    new { |u| u.guest = true }
  end

  def name
    guest? ? "Guest" : email
  end

  protected

  def password_required?
    puts guest?
    !persisted? || !password.nil? || !password_confirmation.nil? && !guest?
  end

  def email_required?
    guest?
  end

end





# class User < ActiveRecord::Base
#   has_many :tasks, dependent: :destroy

#   attr_accessible :username, :email, :password, :password_confirmation

#   validates_presence_of :username, :email, :password_digest, unless: :guest?
#   validates_uniqueness_of :username, allow_blank: true
#   validates_confirmation_of :password

#   # override has_secure_password to customize validation until Rails 4.
#   require 'bcrypt'
#   attr_reader :password
#   include ActiveModel::SecurePassword::InstanceMethodsOnActivation
  

  
#   def name
#     guest ? "Guest" : username
#   end
  
#   def move_to(user)
#     tasks.update_all(user_id: user.id)
#   end
# end