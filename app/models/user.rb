class User < ActiveRecord::Base
  require 'enumerator'
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
      welcome = home.children.create(title: 'Welcome to DeepThought!', rank: 0, user_id: self.id)
      welcomeChildren = [
        'Please note that as a guest, you will not be able to log back into this account after leaving.',
        '⇧+ delete on the parent bullet to start with a blank page. Otherwise, read more about DeepThought below!',
        'Features of DeepThought',
        'Pending Features'
      ]

      welcomeChildren.map!.with_index { |text, i|
        welcome.children.create(title: text, rank: i, user_id: self.id)
      }
      featureChildren = [
        'Keyboard Shortcuts',
        'Zooming in and out of pages',
        'Tabbing in and out with ease',
        'Moving bullets around the page',
        'Starring pages',
      ]

      featureChildren.map!.with_index  { |text, i|
        welcomeChildren[2].children.create(title: text, rank: i, user_id: self.id)
      }

      featureChildren[0].children.create(title: 'Click the below tab to see all the available commands', rank: 0, user_id: self.id)
      featureChildren[1].children.create(title: 'Click on the bullet point on the left to zoom into this page', rank: 0, user_id: self.id)
      featureChildren[1].children.create(title: 'Navigate quickly with keyboard shortcuts', rank: 1, user_id: self.id)
      featureChildren[4].children.create(title: 'Keep track of your important pages, by clicking that star in the top right corner', rank: 0, user_id: self.id)
      featureChildren[4].children.create(title: 'View all starred pages quickly by clicking on the star button in the header', rank: 1, user_id: self.id)

      pendingChildren = [
        'Drag and drop to move around tasks',
        'Improved search'
      ]

      pendingChildren.map!.with_index  { |text, i|
        welcomeChildren[3].children.create(title: text, rank: i, user_id: self.id)
      }
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