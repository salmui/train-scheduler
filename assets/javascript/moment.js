$(document).ready(function(){
	// Initialize Firebase
var config = {
	apiKey: "AIzaSyB5l-vOw1YdJoIkHPoZie6giwx62mVwKSc",
	authDomain: "train-scheduler-8f2d3.firebaseapp.com",
	databaseURL: "https://train-scheduler-8f2d3.firebaseio.com",
	projectId: "train-scheduler-8f2d3",
	storageBucket: "train-scheduler-8f2d3.appspot.com",
	messagingSenderId: "680485138265"
};
firebase.initializeApp(config);


  	var database = firebase.database();

  	var trainName = "";
  	var destination = "";
  	var firstTrain = "";
  	var frequency = 0;
  	//firstTrain/frequency user input calculation
  	var nextArrival = 0;
  	var minutesAway = 0;

	// 2. Button for adding Trains
	$("#addTrainBtn").on("click", function(){
		event.preventDefault();

		// Grabs user input and assign to variables
		var trainName = $("#trainNameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequencyInput").val().trim();


		console.log(trainName);
		console.log(destination);
		console.log(trainTimeInput);
		console.log(frequencyInput);

		// Creates object for holding train data
		// Will push this to firebase
		var newTrain = {
			name:  trainName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		}

		// pushing trainInfo to Firebase
		database.ref().push(newTrain);

		// clear text-boxes
		$("#trainNameInput").val("");
		$("#destinationInput").val("");
		$("#trainInput").val("");
		$("#frequencyInput").val("");


	});

	database.ref().on("child_added", function(childSnapshot, prevChildKey){

		console.log(childSnapshot.val());

		// assign firebase variables to snapshots.
		var firebaseName = childSnapshot.val().name;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;

		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

		console.log(minutes);
		console.log(nextTrainArrival);
		console.log(moment().format("hh:mm A"));
		console.log(nextTrainArrival);
		console.log(moment().format("X"));

		// Append train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
});
