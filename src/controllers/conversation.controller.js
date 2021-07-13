const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { conversationService, userService, messageService } = require('../services');
const ApiError = require('../utils/ApiError');

const createConversation = catchAsync(async (req, res) => {
    const conversation = await conversationService.createConversation(req.body)
    res.status(httpStatus.OK).send(conversation);
});

const getConversation = catchAsync(async (req, res) => {
    const conversation = await conversationService.getConversationById(req.params.conversationId);
    if (!conversation) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }
    res.status(httpStatus.OK).send(conversation);
});

const getConversations = catchAsync(async (req, res) => {
    const conversations = await conversationService.getAllConversations();
    res.status(httpStatus.OK).send(conversations);
});

const getMyConversations = catchAsync(async (req, res) => {
   const conversations = await conversationService.findconversation({participants: req.params.userId});
    const myConversations = [];
    for (let x=0; x < conversations.length; x++)
    {
        
        let message = await messageService.getAllMessagesInConversationsx(conversations[x]["_id"]);
        let user1 =  await userService.getUserById(conversations[x]["participants"][0]);
        let user2 =  await userService.getUserById(conversations[x]["participants"][1]);

        console.log(user1+"\n"+ user2);
        let conversation = conversations[x];
        let patName = "";
        let docName = "";
        let patId = "";
        let docId = "";


        console.log(conversation["participants"]);


        if(user1["role"] == "patient"){
            

            console.log(conversations[x]);
            docName = user2.firstname+" "+  user2.lastname;
            docId = user2._id;
            patName =  user1.firstname+" "+  user1.lastname;
            patId =  user1._id;

        }
        else{
            docName = user1.firstname+" "+  user1.lastname;
            docId = user1._id;
            patName =  user2.firstname+" "+  user2.lastname;
            patId =  user2._id;
        }
        

//         if (conversations[x]["participants"][1]["role"] == "doctor"){
//             docName =  conversations[x]["participants"][1]["firstname"] + " " + conversations[x]["participants"][1]["lastname"];
//             docId = conversations[x]["participants"][1]["_id"];
//         }
// 
       /* if (conversations[x].participants[0].role == "patient" ){
            
        }
        else if (conversations[x]["participants"][1]["role"] == "patient"){
            
        }
        else{
            console.log("pat not at 0");
        }

        if(conversations[x]["participants"][1]["role"] == "doctor"){
            docName =  conversations[x]["participants"][1]["firstname"] + " " + conversations[x]["participants"][1]["lastname"];
            docId = conversations[x]["participants"][1]["_id"];
        }*/
       


        let messages= "";
        if(message[message.length-1]==undefined ){
            messages= "No Messages!";
        }
        else{
            messages= message[message.length-1]["content"]
        }
        myConversations.push({"coversationId":conversations[x]["_id"],"patientName": patName,"doctorName":docName,"patientId":patId,"doctorId":docId,"lastMessage":messages});
    }
   
    

    res.status(httpStatus.OK).send(myConversations);
});

const getUsersConversations = catchAsync(async (req, res) => {
    const conversations = await conversationService.getAllUsersConversations();
    res.status(httpStatus.OK).send(conversations);
});

const updateConversation = catchAsync(async (req, res) => {
    const conversation = await conversationService.updateConversation(req.body, req.params.conversationId);
    res.status(httpStatus.OK).send(conversation);
});

const deleteConversation = catchAsync(async (req, res) => {
    await conversationService.deleteConversation(req.params.conversationId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createConversation,
    getConversation,
    getConversations,
    getUsersConversations,
    updateConversation,
    deleteConversation,
    getMyConversations
};
