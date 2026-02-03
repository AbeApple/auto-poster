step 1:
project layout and auth

please add .env to the gitignore

do not run any commands, if things need to be installed or commands run say that at the end and I will ru>n them

we will also set up the project structure and start out with auth funcionality
in the src/features folder we have
/auth
/search
/data
/landing
/profile

each contains the js and css files for their feature 

in the auth we have a authbox.js which allows the user to log in or create an account
we also have auth page which has 100% height and width and centers the auth box
we also have authswitch which pulls the user object from redux slice and if its null it shows the auth page, if it exists it shows the component that is passed into it as a prop
also auto-loging which we will set up later

we have the src/global
with /supabase (with supabase setup)
and /redux
with the store and /slices containing the slices file

we have src/layout
which contains topnav.js
and initializer.js
this file uses on auth change supabase listener to put the user object in redux whenever it changes

in app.js we have the topnav
and a router
and the routes are 
/ for the landing page landing.js
/search (shows auth if no use using the authswitch, otherwise shows search.js)
/auth (always shows auth page)
/auto-login 
/profile
lets use hashrouter

so the user starts at for example /
they click in the topnav log in or sign up and they are sent to /auth
there is a login box
they click "create account" 
enter fields
press create account
supabsae is caled to create the account
on the response to that being successful they are redirected to search
that account creation saves things so the auth state listener picks up the user and puts it in the redux slice
the /search auth switch sees the user in redux and shows the search page
for now there is just a search box at the top and a search button
there are logs showing what is happening every step of the way 

in this initial setup it will be a black and yellow theme
the colors are defined in the app.css and used throught the app
this applicaiton is for a user being able to add cars with images to a database in a very simple stremlined way


part 2:
data
on now in the search componets in the search dire we will add a data tile component. this will be a square that will display as a data result. we will add sample data for the aray of jaons that will map there. 
the box will be a square with an image taking up the full height and width with cover css and it will have a the bottom a semi transparent yellow part that has black text over it with the reg number of the car and the make and model info. put 10 of these in the sameple data. we will put hte css file for this in the same level as the search page because we will use the tile css for one more thing, we will use it for a new icon. this will have ht esame box with a yellow border and 5px border radius but htis one will have centered in the middle a yellow circle with a black plus and yellow text saying "New". 

when this is clicked it will set redux state for creatingNew to true. this will cause an overlay to show over the search page. the redux state will be selected in the search componen and it will determine if the src/data/NewItem.js file shows. this file will have a ful lheight and width (over the topnav even) and it will have just two inputs, the car reg and the miles. at the bottom ther ewill be two buttons, on the left it will say cencel (which will jsut set the redux state so the overlay dissapears) and on the right it will say create with a picture of a camera and a right facing chevron arrow on the right of that text

we will pause there to inspect ot see if it is allworing properl n

step 3:
ok now that htis is working we will actually load the data from teh database in search. for now just load all of the data and diplay it properly in the search area in the tiles. 

in the new item display we will create the row when the user clicks the button on the bottom right. it will create the row in the database and open the camera. in the new item overlay component we can have a step state and the first step is to add thos two fields and create the reow, the next step is to open the camera. this will make a camera component show. the creation of the row will save the id of the new row in the new itme overlay component and that will be given to the camera component. the camera componen lives in src/util 

there is a src/util dir that has a camera component in it
it opens the camere and ther are 4 buttons at the bottom
delete & exit (slight reddish), retake (yellow), save & done, save & next 
when the user presses one of these it does the approprate action
the camera componet saves into the place its told to
we will have a setup in the bucket car-images
they will be stored in the car-images/user-id/row-id (row id of the car row that was created)/<image here>
when the user clicks save and done or delete and done or whatever that makes them leave this we set the display id to the id of the new row and the creating new to false. these state variables are mutually exclusive and cause different menus to show. 

when the id is set we will have another overlay that will be the display of the detail of the data.

this will also display when one of the ties is clicked

this page will have the details such as the images at the top and the other details all with input fields. we can have other details as well like "note" make model etc 
this does not have state for each one but just the data that is loaded from the cars table with the id that is from redux. 

its looking good for basic build



ok a few more features to add and we can call it done:
1: 
deleting images (using a confirm box util that can be reused elsewhere) 
so there can be a red x button on the images in detail display and when clicked it shows the new confirm component (that has a semi transparent overlay over everythign outside of it that when clidked closes it, then a box that looks a bit like the auth box, and it has a message and a cancel and confirm, both with funcitons from props, and when confirming it deletes the imagesa nd reloads the search and the item detail sto reflect the change, and on cancel it jsut sets the state to make it not show the confirm box)

2:
paging the search results
so a new search pager compoennt with the display and logic, that takes a page range and set page range as propse from the search page and increments it in 10s

3:
updating the data in the detail view to the database when it changes

4:
auto login route with the email and password in the search params so a link can be sent to a non-tech savy person and they can be logged in automatically

5: 
delete record
at the bottom instead of just hte done button there is a delete button on the left and dont on the right both half width
the delete button shows the confirm box and when confirmed deletes that record and triggers refresh of search data and closes that item detail window

6: 
downloading /exporting 
table data into a csv 
images in folders named as the car reg (with duplicates being samereg2...)
so we would have a zip or somehting that can be used on mac and its CarImages/<reg1>, <reg2>,... with the images for that car in that folder
when the download exporet button is cliecke it opens a dialogue box like the confirm indow tha asks the user wha thtey want to downlaod, all data, all images, search result images, search result data. 
when they clicke the button there is a message that says downlaodthing then it dow download

7:
list view
the toggle under search has a list view instead of the tile view. shows like a csv spreadsheet

8 finish
put on render.com
create account for them
send to guy