this contains the previous dashboard css content such that we can reverse anytime


* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}

body {
  font-family: Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: center; 
  align-items: center;
  margin-top: -20px;
  margin-bottom: -20px;
  margin-left:2.5%;
  margin-right:2.5%;
}

.navbar .logo {
  margin-right: auto; /* Push the logo to the left */
  width: 200px; /* Adjust logo size */
}

.navbar a {
  margin-left: 20px;
  margin-right: 20px;
  text-decoration: none;
  color: #000; /* Change to preferred color */
  /* font-weight: bold; */
  font-size: 25px;
}

.navbar a:hover {
  color: #e62845; /* Change to preferred hover color */
}
.dashboard-container {
  display: flex;
  height: calc(100vh - 60px); /* Adjust for navbar height */
}

.sidebar {
  min-width: 300px;
  width: 300px;
  background-color: white;
  padding: 15px;
  overflow-y: auto;
  border-top: solid rgb(129, 129, 129) 2px;
}

/* .sidebar::-webkit-scrollbar {
  display: none;
} */

/* For WebKit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1; 
}

::-webkit-scrollbar-thumb {
  background: #888; 
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

.sidebar h2 {
  color: #333;
}

#search-bar {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

#test-case-list {
  list-style: none;
  padding: 0;
}
/* #test-case-list::-webkit-scrollbar {
  display: none;
} */


#test-case-list li {
  /* background-color: #cc1934; */
  color: black;
  padding: 15px;
  opacity: 0.5;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 5px;
}




#test-case-list li:hover {
  background-color: #c02038;
  color:white;
  opacity: 1;

}

.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #cc1934;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; 
  
}

.content h2 {
  padding-bottom: 30px;
  color:#fff ;
}

#test-case-details {
  width: 90%;
  height: 90%;
  background-color: #e6e6e6;
  padding: 20px;
  border-radius: 10px;
  overflow-y: auto;
}
#test-case-details li {
  width: 90%;
  height: 90%;
  background-color: #d0d0d0;
  padding: 20px;
  border-radius: 10px;
  overflow-y: auto;
}

/* Dropdown button styling */
button {
  width: 50%; /* Make the button fit the full width of its container */
  padding: 10px;
  margin-top: 10px;
  background-color: #c02038; /* Button color */
  color: #fff; /* Text color */
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #a01b2f; /* Hover color */
}

button:focus {
  outline: none;
}

/* Styling for failure/details container */
ul#failure-details,
ul#details {
  width: 100%;
  background-color: #f2f2f2; /* Background color for details */
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  display: none; /* Initially hidden, toggled by JavaScript */
}

/* Ensuring all text and list items inside details are aligned properly */
ul#failure-details li,
ul#details li {
  font-size: 14px;
  color: #333;
  padding: 5px 0;
}

ul#failure-details p,
ul#details p {
  margin: 5px 0;
}
li {
  padding-bottom: 20px;
}
#test-case-button {
  padding-bottom: 20px;
}

 /* #chart-container
{
  margin-right:65%;
  width:25%;
  height:auto;
  background-color: rgb(252, 139, 139);
  border-radius: 5%;
  padding:2%;
  display:none;
  border:solid black;
} */

.test-case-amount-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99%;
  margin-bottom: 20px;
  gap:1%;
  display:none;
}

.chart-container,
.test-case-amount,
.passing-rate {
  width: 30%;
  height: 350px; /* Set a fixed height */
  background-color: white;
  border: solid rgb(0, 0, 0);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5%;

}

.chart-container {
  /* background-color: rgb(252, 139, 139); */
  padding: 2%;
  /* border: solid black; */
}

.test-case-amount h3,
.passing-rate h3 {
  margin-top: 0;
}

.test-case-amount span,
.passing-rate span {
  font-size: 36px;
  font-weight: bold;
}













.test-case-table th, .test-case-table td {
  padding: 10px;
  /* border-bottom: 1px solid #999; */
  text-align: left;
}

.test-case-table th {
  background-color: #999;
}

/* .test-case-table tr:nth-child(even) {
  background-color: #9f9f9f9f;
}
.test-case-table tr:nth-child(even) {
  background-color: #aaa;
}
*/


.test-case-table td{
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: solid;
} 
.test-case-table tr{
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: solid;
} 

/* Styling for Popup */
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden; /* Prevents the scroll from affecting the popup container */
}

/* Prevent horizontal scrolling in the popup */
.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 60%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto; /* Only vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  word-wrap: break-word; /* Ensure text wraps inside the popup */
  display: flex;
  flex-direction: column;
}

/* Make sure the popup content itself keeps the rounded corners while scrolling */
.popup-content::-webkit-scrollbar {
  width: 8px;
}

.popup-content::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 10px;
}

.popup-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Styling for Popup Close Button */
.popup-close-btn {
  background-color: #c02038; /* Background color of the button */
  color: white; /* Text color */
  border: none;
  width: 30px; /* Size of the button */
  height: 30px; /* Ensure it's a circle */
  border-radius: 50%; /* Make it circular */
  font-size: 20px; /* Adjust the size of the 'X' */
  display: flex;
  align-items: center;
  justify-content: center; /* Center the 'X' */
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.popup-close-btn:hover {
  background-color: #a01b2f; /* Hover color */
}

.popup-close-btn:focus {
  outline: none;
}

.popup-container .popup-content p {
  margin: 10px 0;
}

/* To allow the user to close the popup by clicking the background */
.popup-container:hover {
  cursor: pointer;
}

.popup-container .popup-content:hover {
  cursor: auto;
}

.success_img
{
  width:50px;
  height:50px;
}

.failure_img
{
  width:60px;
  height:60px;
}




