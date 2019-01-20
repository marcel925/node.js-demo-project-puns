# node.js-demo-project-puns
Features:
Users can sign up, sign in, logout. Used npm package passport for users. 
Users can create, read, update and delete puns. No duplicate puns are allowed. 
Users can vote on puns by upvoting and downvoting. 
There is a "/name" route where puns are filtered by name. 
The puns are always sorted by highest votes first. 
There is a profile route where you can see that user's total number of submission, total upvotes received, total downvotes received and all that users pun submissions. 
Users receive flash messages throughout their browsing via npm package connect-flash. 
Connected the app successfully to a cloud mongoDB server through mLabs (changed mongoose conncect back to local for security purposes)
