# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
 
home = Entry.create(title: 'Home', rank:0)
# child1 = home.children.create title:'Welcome to DeepThought.', rank:1
# child2 = home.children.create title:'child2', rank:2
# grandchild11 = child1.children.create title:'grandchild11', rank:1.5
# grandchild12 = child1.children.create title:'grandchild12', rank:2.5
# grandchild21 = child2.children.create title:'grandchild21', rank:3
# grandgrandchild111 = grandchild11.children.create title:'grandgrandchild111', rank:2
# grandgrandchild112 = grandchild11.children.create title:'grandgrandchild112', rank:3
# grandgrandchild113 = grandchild11.children.create title:'grandgrandchild112', rank:4
# grandgrandchild121 = grandchild12.children.create title:'grandgrandchild121', rank:4
# grandgrandgrandchild1111 = grandgrandchild111.children.create title:'grandgrandchild1111', rank:2.5
# grandgrandgrandchild1112 = grandgrandchild111.children.create title:'grandgrandchild1112', rank:3.5
# grandgrandgrandchild1121 = grandgrandchild112.children.create title:'grandgrandchild1121', rank:3.5
# grandgrandgrandchild1122 = grandgrandchild112.children.create title:'grandgrandchild1122', rank:4.5
# grandgrandgrandchild1131 = grandgrandchild113.children.create title:'grandgrandchild1131', rank:5
# grandgrandgrandchild1132 = grandgrandchild113.children.create title:'grandgrandchild1132', rank:6