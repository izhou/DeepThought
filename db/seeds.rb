# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
 
home = Entry.create(title: 'Home')
child1 = home.children.create title:'child1'
child2 = home.children.create title:'child2'
grandchild11 = child1.children.create title:'grandchild11'
grandchild12 = child1.children.create title:'grandchild12'
grandchild21 = child2.children.create title:'grandchild21'
grandgrandchild111 = grandchild11.children.create title:'grandgrandchild111' 
grandgrandchild112 = grandchild11.children.create title:'grandgrandchild112' 
grandgrandchild121 = grandchild12.children.create title:'grandgrandchild121' 