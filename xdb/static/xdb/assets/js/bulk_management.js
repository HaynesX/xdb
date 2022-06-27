var currentPosts = null
var currentPostsWins = null
var currentRandomGenWinType = null
var currentRandomGenPrizeMoney = null
var currentRandomGenWinners = null



$('.slick-slider').slick({
    dots: true,
    infinite: true,
    speed: 1000,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 8000,
});

$(document).ready(function () {
    setTimeout(function () { $(".page-loader").hide(); }, 700);
});

$(document).on('click', '.navbar-toggle', function () {
    $('#custom-collapse').toggleClass('in');
    $('#custom-collapse').toggleClass('animation-js');

    if($('#custom-collapse').hasClass('in')){
        setTimeout(() => {
            $('#custom-collapse').removeClass('animation-js')
        },1000)
    }

    else if (!$('#custom-collapse').hasClass('in')){
        $('#custom-collapse').removeClass('animation-js')
    }
});

$(".menu-item").click(function () {
    if ($(this).hasClass("open")) {
        $(".menu-item").removeClass("open");
    }
    else {
        $(".menu-item").removeClass("open");
        $(this).addClass("open");
    }
});




socket.onmessage = function(e) {
    const data = JSON.parse(e.data)
    console.log(data)


    spreadsheetID = data['spreadsheetID']
    statusMessage = data['status']
    exportDate = data['exportDate']

    if (statusMessage == 'successful') {

        $("#" + spreadsheetID).attr("href", `/export_csv/` + spreadsheetID)
        $("#" + spreadsheetID).removeClass("csv_file_status_running")
        $("#" + spreadsheetID).addClass("csv_file_status_successful")
        $("#icon-" + spreadsheetID).attr("class", "fa fa-arrow-down")

        



        
    }
    else if (statusMessage == 'running') {
        $(".export_csv_files_container").prepend(

            `<div class="csv_file">
            <div class="csv_file_text_container">` + exportDate + `</div>
            <a id="` + spreadsheetID + `" class="csv_file_status_container csv_file_status_running date_range_input_end"><i id="icon-` + spreadsheetID + `" class="fa fa-spinner fa-spin" style="font-size:15px"></i></a>
        </div>`)

    }
    else {
        $("#" + spreadsheetID).removeClass("csv_file_status_running")
        $("#" + spreadsheetID).addClass("csv_file_status_fail")
        $("#icon-" + spreadsheetID).attr("class", "fa fa-exclamation-triangle")
    }





}



function sendMessageToSocket() {

    socket.send(JSON.stringify({
        'post_ids': [59, 58, 57],
        'export_posts': true,
        'export_wins': true,
        'win_type': "",
        "prize_money": ""
    }));

}





var csrf_token = $("input[name=csrfmiddlewaretoken]").val()
const elem = document.getElementById('range');
const dateRangePicker = new DateRangePicker(elem, {
    format: 'dd/mm/yyyy',
    defaultViewDate: 'today',
    todayHighlight: true
});


function showAlert(text, type) {
    $('#alert').attr("class", "alert " + type)
    $('#alert').fadeIn(800)
    $('#alert').text(text)
    setTimeout( function() { $('#alert').fadeOut(1000); }, 1000);
}







function getPostFiltersInput() {
    var username = $("#username_input").val()
    var win = $("#win_input_filter").val()
    var startDate = $("#startDate_input").val()
    var endDate = $("#endDate_input").val()

    $(".post-checkbox-input").each(function() {

        $(this).prop("checked", false);
        $(this).trigger("change");



    })

    // $(".posts_added_container").empty()
    $('.posts_added_container').find('*').not('.no_posts').remove();

    return [username, win, startDate, endDate]

}



$(document).on("mouseenter mouseleave", ".post_flex_box", function(e) {

    var infoContainer = $(this).children().eq(1)
    postCheckIcon = $(this).children().eq(0).find(".post_check_icon")
    twitterIcon = $(this).children().eq(0).find(".post_twitter_icon")



    // infoContainer.css("display", "flex")
    

    if (infoContainer.attr("class") == "post_information_box collapsible") {


        infoContainer.attr("class", "post_information_box collapsed")


        if (postCheckIcon.hasClass("win_color")) {
            postCheckIcon.attr("class", "post_check_icon date_range_input_start win_color")
            
        }
        else {
            postCheckIcon.attr("class", "post_check_icon date_range_input_start")
        }


        




        twitterIcon.attr("class", "post_twitter_icon date_range_input_end")
    } else {

    
        infoContainer.attr("class", "post_information_box collapsible")

        if (postCheckIcon.hasClass("win_color")) {
            postCheckIcon.attr("class", "post_check_icon win_color")
        }
        else {
            postCheckIcon.attr("class", "post_check_icon")
        }



        twitterIcon.attr("class", "post_twitter_icon")
    }

})





$(document).on("click", ".action_container", function(e) {
    console.log("hello")

    var infoContainer = $(this).next()
    // postCheckIcon = $(this).children().eq(0).find(".post_check_icon")
    // twitterIcon = $(this).children().eq(0).find(".post_twitter_icon")



    // infoContainer.css("display", "flex")

    if (infoContainer.attr("class") == "action_buttons_container collapsible_actions") {
        infoContainer.attr("class", "action_buttons_container collapsed_actions")
        // postCheckIcon.attr("class", "post_check_icon date_range_input_start")
        // twitterIcon.attr("class", "post_twitter_icon date_range_input_end")
    } else {
        infoContainer.attr("class", "action_buttons_container collapsible_actions")
        // postCheckIcon.attr("class", "post_check_icon")
        // twitterIcon.attr("class", "post_twitter_icon")
    }

})




$(document).on("click", ".edit_win_main_container", function(e) {
    console.log("hello")

    var infoContainer = $(this).next()
    // postCheckIcon = $(this).children().eq(0).find(".post_check_icon")
    // twitterIcon = $(this).children().eq(0).find(".post_twitter_icon")



    // infoContainer.css("display", "flex")

    if (infoContainer.attr("class") == "action_buttons_container collapsible_edit_win") {
        infoContainer.attr("class", "action_buttons_container collapsed_edit_win")
        // postCheckIcon.attr("class", "post_check_icon date_range_input_start")
        // twitterIcon.attr("class", "post_twitter_icon date_range_input_end")
    } else {
        infoContainer.attr("class", "action_buttons_container collapsible_edit_win")
        // postCheckIcon.attr("class", "post_check_icon")
        // twitterIcon.attr("class", "post_twitter_icon")
    }

})














function selectFunc(selector) {

    var areAllSelected = true

    $(selector).each(function () {
        checkMarkInput = $(this)

        if (checkMarkInput.prop("checked") == true) {
            console.log("true")
        } else {
            areAllSelected = false
            return false
        }

    })
    console.log("returned true")


    if (areAllSelected) {
        $(selector).each(function () {
            checkMarkInput = $(this)
            checkMarkInput.prop("checked", false );
            checkMarkInput.trigger("change");
            console.log(checkMarkInput)
        })
    } else {
        $(selector).each(function () {
            checkMarkInput = $(this)

            if (!($(this).is(":checked"))) {
            checkMarkInput.prop("checked", true );
            checkMarkInput.trigger("change");
            console.log(checkMarkInput)
                
            }
        })
    }


}
    
















$("#posts_button_select_all").click(function(){
    

    console.log("here")

    selectFunc(".post-checkbox-input")

    // var areAllSelected = true

    // $(".post-checkbox-input").each(function () {
    //     checkMarkInput = $(this)

    //     if (checkMarkInput.prop("checked") == true) {
    //         console.log("true")
    //     } else {
    //         areAllSelected = false
    //         return false
    //     }

    // })


    // if (areAllSelected) {
    //     $(".post-checkbox-input").each(function () {
    //         checkMarkInput = $(this)
    //         checkMarkInput.prop("checked", false );
    //         console.log(checkMarkInput)
    //     })
    // } else {
    //     $(".post-checkbox-input").each(function () {
    //         checkMarkInput = $(this)
    //         checkMarkInput.prop("checked", true );
    //         console.log(checkMarkInput)
    //     })
    // }


})







$("#posts_button_select_wins").click(function(){

    selectFunc(".is_winner")

    // var areAllSelected = true
    // console.log("YOOOOO")

    // $(".is_winner").each(function () {
    //     console.log("YOOOOO")
    //     checkMarkInput = $(this)

    //     if (checkMarkInput.prop("checked") == true) {
    //         console.log("bruh")
    //     } else {
    //         areAllSelected = false
    //         return false
    //     }

    // })


    // if (areAllSelected) {
    //     $(".is_winner").each(function () {
    //         checkMarkInput = $(this)

    //         checkMarkInput.prop("checked", false );
    //         console.log(checkMarkInput)

    //     })
    // } else {
    //     $(".is_winner").each(function () {
    //         checkMarkInput = $(this)

    //         checkMarkInput.prop("checked", true );
    //         console.log(checkMarkInput)


    //     })
    // }


})





$("#posts_button_select_non_wins").click(function(){

    selectFunc(".is_NOT_winner")

    // var areAllSelected = true
    // console.log("YOOOOO")

    // $(".is_NOT_winner").each(function () {
    //     console.log("YOOOOO")
    //     checkMarkInput = $(this)

    //     if (checkMarkInput.prop("checked") == true) {
    //         console.log("bruh")
    //     } else {
    //         areAllSelected = false
    //         return false
    //     }

    // })


    // if (areAllSelected) {
    //     $(".is_NOT_winner").each(function () {
    //         checkMarkInput = $(this)

    //         checkMarkInput.prop("checked", false );
    //         console.log(checkMarkInput)

    //     })
    // } else {
    //     $(".is_NOT_winner").each(function () {
    //         checkMarkInput = $(this)

    //         checkMarkInput.prop("checked", true );
    //         console.log(checkMarkInput)


    //     })
    // }


})



$(document).on('click','.posts_button_edit_wins_select_all',function(){

    console.log("wagwan")

    var post_id = $(this).attr("post_wins_select_all_id")    

    selectFunc(".win__id__" + post_id)


})


















    

// })



// $(".post_flex_box").hover(function(){

//     console.log("hello")

//     var infoContainer = $(this).children().eq(1)
//     postCheckIcon = $(this).children().eq(0).find(".post_check_icon")
//     twitterIcon = $(this).children().eq(0).find(".post_twitter_icon")



//     // infoContainer.css("display", "flex")

//     if (infoContainer.attr("class") == "post_information_box collapsible") {
//         infoContainer.attr("class", "post_information_box collapsed")
//         postCheckIcon.attr("class", "post_check_icon date_range_input_start")
//         twitterIcon.attr("class", "post_twitter_icon date_range_input_end")
//     } else {
//         infoContainer.attr("class", "post_information_box collapsible")
//         postCheckIcon.attr("class", "post_check_icon")
//         twitterIcon.attr("class", "post_twitter_icon")
//     }
    


// })









function generateRandomWinners(total_winners, allow_duplicate_winners, selected_post_ids) {

    console.log(currentPosts)

    var chosenWinnerIndex = 0

    var chosenWinningIDs = []

    if (allow_duplicate_winners) {
        while (chosenWinningIDs.length < total_winners) {
            chosenWinnerIndex = Math.floor(Math.random() * selected_post_ids.length);
            chosenWinningIDs.push(selected_post_ids[chosenWinnerIndex])

        }
        

    } else {
        while (chosenWinningIDs.length < total_winners) {
            chosenWinnerIndex = Math.floor(Math.random() * selected_post_ids.length);

            if (!(chosenWinningIDs.includes(selected_post_ids[chosenWinnerIndex]))) {
                chosenWinningIDs.push(selected_post_ids[chosenWinnerIndex])
            }
        }
        
    }


    var winningPosts = []

    chosenWinningIDs.forEach(chosenID => {
        currentPosts.forEach(post => {
            if (chosenID == post["id"]) {
                winningPosts.push(post)
            }
        });
    });

    console.log("Chosen Winning IDs" + chosenWinningIDs)
    console.log("Winners:")
    console.log(winningPosts)
    winningPosts.forEach(post => {

        console.log(post["id"] + " / " + post["user__telegram_username"] + " / " + post["telegram_message_id"] + " / " + post["tweet_id"] + " / " + post["telegram_message_date"])


        // console.log(post[0] + " / " + post[1] + " / " + post[3] + " / " + post[4] + " / " + post[5])
        // console.log("bruh")
    });

    return winningPosts





    // user__telegram_username
    // telegram_message_id
    // tweet_id
    // telegram_message_date
    


    
}










$("#generate_wins").click(function(){

    var selectedPostIDs = []


    $(".post-checkbox-input:checked").each(function () {

        selectedPostIDs.push($(this).attr("post_id"))
    })

    var winInputValue = $("#win_input").val()
    var prizeInputValue = $("#prize_money_generate_random_input").val()
    var totalWinnersInputValue = $("#total_winners_generate_random_input").val()
    var allowDuplicateWins = $("#allow_duplicate_wins_generate_random_input").is(":checked")

    if (selectedPostIDs.length == 0) {
        showAlert("No Posts Selected", "alert-danger")
        return
    }

    if (prizeInputValue < 0) {
        showAlert("Prize Less Than 0", "alert-danger")
        return
    }

    if (totalWinnersInputValue < 1) {
        showAlert("Please Have At Least 1 Winner", "alert-danger")
        return
    }

    if (totalWinnersInputValue > selectedPostIDs.length && allowDuplicateWins == false) {
        showAlert("Total Winners MORE THAN The Selected Posts.", "alert-danger")
        return
    }

    console.log(totalWinnersInputValue)
    console.log(allowDuplicateWins)
    console.log(selectedPostIDs.length)
    winners = generateRandomWinners(totalWinnersInputValue, allowDuplicateWins, selectedPostIDs)
    console.log(winners)


    var containerOfWins = $("#random_winner_container")
    containerOfWins.empty()

    winners.forEach(winner => {
        containerOfWins.append(

            `
            <div class="winner_card">

                        <div class="winner__username_and_date_container">
                            <div class="winner__username_box">` + winner['user__telegram_username'] + `</div>
                            <div class="winner__date_box">` + winner['telegram_message_date'] + `</div>
                        </div>

                        <div class="winner__tweet_text_container">
                            <div class="winner__tweet_text">` + winner['tweet_text'] + `</div>
                        </div>

                        <div class="winner__telegram_and_twitter_container">
                            <div class="winner__telegram_box"><a href="https://t.me/DigitalBitsPriceChat/` + winner['telegram_message_id'] + `" target="_blank" class="post_social_link"><i class="fa fa-telegram"></i></a></div>
                            <div class="winner__twitter_box"><a href="https://twitter.com/XDB/status/` + winner['tweet_id'] + `" target="_blank" class="post_social_link"><i class="fa fa-twitter"></i></a></div>
                        </div>


                    </div>
            `

            


        )
    });
    $("#random_winner_modal").css("display", "flex")

    currentRandomGenWinners = winners
    currentRandomGenPrizeMoney = prizeInputValue
    currentRandomGenWinType = winInputValue






    // post_check_icon
    // post_id
    // post_id_text
    // post_username
    // post_username_text




})





$("#giveaway_confirm_winners").click(function(){

    var currentPostContainer = null
    var specificElems = []
    var specificCheckBox = null
    var winningIDs = []

    currentRandomGenWinners.forEach(winner => {
        winningIDs.push(winner['id'])
        
    });


    $("#random_winner_modal").css("display", "none")

    




    $.ajax({
        url: origin + "/wins/create/",
        type: 'post',
        data: {
            post_ids: winningIDs,
            win_type: currentRandomGenWinType,
            prize_money: currentRandomGenPrizeMoney,

            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("FAIL. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            showAlert("Added Wins Successfully", "alert-success")

            var currentPostUsername = null
            var currentPostTweetID = null
            var currentPostTelegramID = null



            var currentPost = null
            var postUsername = null
            var postTweetID = null
            var postTelegramID = null

            response.data["successfulWins"].forEach(winner => {
                currentPost = getPostFromCurrentPosts(winner["id"])
                postUsername = currentPost[0]
                postTweetID = currentPost[1]
                postTelegramID = currentPost[2]




                





                specificElems = []
                currentPostContainer = $(`[post_box_id=` + winner['id'] + `]`)
                specificElems.push(currentPostContainer.find(`.post_check_icon`))
                specificElems.push(currentPostContainer.find(`.post_id`))
                specificElems.push(currentPostContainer.find(`.post_id_text`))
                specificElems.push(currentPostContainer.find(`.post_username`))
                specificElems.push(currentPostContainer.find(`.post_username_text`))

                specificElems.forEach(element => {
                    if (!(element.hasClass("win_color"))) {
                        element.addClass("win_color")
                    }
                });

                specificCheckBox = $(`[post_id=` + winner['id'] + `]`)

                if (!(specificCheckBox.hasClass("is_winner"))) {
                    specificCheckBox.removeClass("is_NOT_winner")
                    specificCheckBox.addClass("is_winner")
                    currentPostsWins[winner["id"]] = {}
                    currentPostsWins[winner["id"]][winner["win_id"]] = {"win_type": winner["win_type"], "prize_money": winner["prize_money"]}

                    createPostWinsCard(winner["id"], postUsername, postTelegramID, postTweetID)
                    createPostWinsInsideCard(winner["id"])
                    
                }
                else {
                    currentPostsWins[winner["id"]][winner["win_id"]] = {"win_type": winner["win_type"], "prize_money": winner["prize_money"]}
                    removeAllPostWinsInsideCard(winner["id"])
                    createPostWinsInsideCard(winner["id"])
                }

                





                





            });


            response.data["failedWins"].forEach(failedWin => {
                setTimeout(function() { showAlert(`Post ` + failedWin[0] + `: ` + failedWin[1] + ``, "alert-danger"); }, 2000);

                





            })

















        }
        
        })













})






$("#giveaway_cancel_winners").click(function(){
    $("#random_winner_modal").css("display", "none")



})







































$(document).on('click','#ajax-search-posts',function(){

    filterValues = getPostFiltersInput()




    $.ajax({
        url: origin + "/posts/filter/",
        type: 'post',
        data: {
            filter_username: filterValues[0],
            filter_win: filterValues[1],
            filter_startDate: filterValues[2],
            filter_endDate: filterValues[3],

            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("FAIL. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            showAlert("Got Posts Successfully", "alert-success")
            console.log(response.data["posts"])
            currentPosts = response.data["posts"]


            postsContainer = $(".posts_added_container")

            if (response.data["posts"].length == 0){
                $(".no_posts").css("display", "block")
                console.log("yo")
            }
            else {
                $(".no_posts").css("display", "none")
            }

            console.log(response.data["posts"].length)


            response.data["posts"].forEach(post => {

                var addedWinnerClass = "is_NOT_winner"
                var winColor = ""

                if(post['is_winner'] == true){
                    console.log("yehhhhhhhhhhhhhhhh")
                    addedWinnerClass = "is_winner"
                    winColor = "win_color"
                }

                postsContainer.append(

                    `
                    <div class="post_flex_box">
                        <div class="post_container fade-in" post_box_id=` + post['id'] + `>

                        <div class="post_check_icon date_range_input_start ` + winColor + `">
                            <input type="checkbox" post_id=` + post['id'] + ` class="post-checkbox-input ` + addedWinnerClass + `">
                            
                        </div>

                        <div class="post_id ` + winColor + `">
                            <p class="post_id_text ` + winColor + `">` + post['id'] + `</p>
                        </div>


                        <div class="post_username ` + winColor + `">
                            <p class="post_username_text ` + winColor + `">` + post['user__telegram_username'] + `</p>
                        </div>

                        <div class="post_telegram_icon">
                            <a href="https://t.me/DigitalBitsPriceChat/` + post['telegram_message_id'] + `" class="post_social_link" target="_blank"><i class="fa fa-telegram"></i></a>
                        </div>

                        <div class="post_twitter_icon date_range_input_end">
                            <a href="https://twitter.com/XDB/status/` + post['tweet_id'] + `" class="post_social_link" target="_blank"><i class="fa fa-twitter"></i></a>           
                        </div>
                    </div>

                    <div class="post_information_box collapsed">

                                        <div class="information_header">
                                        ` + post['telegram_message_date'] + `
                                        </div>

                                        <div class="information_text_container">
                                            <div class="information_text">
                                            ` + post['tweet_text'] + `
                                            </div>
                                        </div>
                                    </div>


                </div>`


                )
                
            });


            currentPostsWins = response.data["postsWins"]
            console.log(currentPostsWins)

            





        }
    })
})



function checkIfEmptyPostsWins(){
    if($(".post_wins_cards_container").children().length == 1){
        $(".no_wins").css("display", "block")
    }
    else {
        $(".no_wins").css("display", "none")
    }

    console.log($(".post_wins_cards_container").children().length)
}



function createPostWinsCard(post_id, username, telegramID, tweetID) {

    $(".post_wins_cards_container").append(


        `<div class="post_wins_card_container" post_win_card_container_id=` + post_id + `>
        <div class="post_win_container">
            <div class="post_id">
                <p class="post_id_text">` + post_id + `</p>
            </div>
            <div class="post_username">
                <p class="post_username_text">` + username + `</p>
            </div>
            <div class="post_telegram_icon">
                <a href="https://t.me/DigitalBitsPriceChat/` + telegramID + `" class="post_social_link"><i class="fa fa-telegram"></i></a>
            </div>
            <div class="post_twitter_icon">
                <a href="https://twitter.com/XDB/status/` + tweetID + `" class="post_social_link"><i class="fa fa-twitter"></i></a>
            </div>
        </div>

        <div class="select_all_button_row_edit_wins">
            <div class="posts_button_edit_wins_select_all bottom_border_black" post_wins_select_all_id=` + post_id + `>Select All</div>
        </div>

        <div class="posts_wins_wins_container" post_wins_wins_container_id=` + post_id + `>
        </div>
    </div>`




    )

    checkIfEmptyPostsWins()



}



function createPostWinsInsideCard(post_id) {


    var currentPostWinsContainer = $(`[post_wins_wins_container_id=` + post_id + `]`)

            for (let eachWin in currentPostsWins[post_id]) {

                currentPostWinsContainer.append(

                    `<div class="win_container" post_win_container_id=` + eachWin + `>
                    <div class="win_check_icon date_range_input_start">
                        <input type="checkbox" win_id="` + eachWin + `" associated_post_id=` + post_id + ` class="win-checkbox-input win__id__` + post_id + `">
                    </div>
                    <div class="win_id">
                        <p class="post_id_text">` + eachWin + `</p>
                    </div>
                    <div class="win_value_box">
                        <p class="win_value_box_text posts_wins_win_type">` + currentPostsWins[post_id][eachWin]["win_type"] + `</p>
                    </div>
                    <div class="win_value_box date_range_input_end">
                        <p class="win_value_box_text posts_wins_prize_type">$` + currentPostsWins[post_id][eachWin]["prize_money"] + `</p>
                    </div>
                </div>`




                )



                
            };
            checkIfEmptyPostsWins()
    
}



function removeAllPostWinsInsideCard(post_id) {
    var currentPostWinsContainer = $(`[post_wins_wins_container_id=` + post_id + `]`)
    currentPostWinsContainer.empty()
    checkIfEmptyPostsWins()
}





function getPostFromCurrentPosts(post_id){

    var currentPost = null
    for (let index = 0; index < currentPosts.length; index++) {
        currentPost = currentPosts[index];
        if (currentPost["id"] == post_id) {
            postUsername = currentPost["user__telegram_username"]
            postTweetID = currentPost["tweet_id"]
            postTelegramID = currentPost["telegram_message_id"]
            postIndex = index
            return [postUsername, postTweetID, postTelegramID, postIndex]
        }


        
    }







}
    


$(document).on("change", "#export_wins_checkbox", function(e) {
    if ($(this).prop("checked") == true) {

        $(".export_win_types_container").css("display", "flex")


    }
    else {
        $(".export_win_types_container").css("display", "none")
    }


})







$(document).on("change", ".post-checkbox-input", function(e) {

    console.log("yo")

    var postID = $(this).attr("post_id")

    var currentPost = getPostFromCurrentPosts(postID)
    var postUsername = currentPost[0]
    var postTweetID = currentPost[1]
    var postTelegramID = currentPost[2]


    






    if($(this).is(':checked')) {


        if (!($.isEmptyObject(currentPostsWins[postID]))) {

            createPostWinsCard(postID, postUsername, postTelegramID, postTweetID)
            createPostWinsInsideCard(postID)

            // $(".no_wins").css("display", "none")




            // $(".post_wins_cards_container").append(


            //     `<div class="post_wins_card_container" post_win_card_container_id=` + postID + `>
            //     <div class="post_win_container">
            //         <div class="post_id">
            //             <p class="post_id_text">` + postID + `</p>
            //         </div>
            //         <div class="post_username">
            //             <p class="post_username_text">` + postUsername + `</p>
            //         </div>
            //         <div class="post_telegram_icon">
            //             <a href="https://t.me/DigitalBitsPriceChat/` + postTelegramID + `" class="post_social_link"><i class="fa fa-telegram"></i></a>
            //         </div>
            //         <div class="post_twitter_icon">
            //             <a href="https://twitter.com/XDB/status/` + postTweetID + `" class="post_social_link"><i class="fa fa-twitter"></i></a>
            //         </div>
            //     </div>

            //     <div class="select_all_button_row_edit_wins">
            //         <div class="posts_button_edit_wins_select_all bottom_border_black" post_wins_select_all_id="C H A N G E  M E">Select All</div>
            //     </div>

            //     <div class="posts_wins_wins_container" post_wins_wins_container_id=` + postID + `>
            //     </div>
            // </div>`




            // )

            // var currentPostWinsContainer = $(`[post_wins_wins_container_id=` + postID + `]`)

            // for (let eachWin in currentPostsWins[postID]) {

            //     currentPostWinsContainer.append(

            //         `<div class="win_container" post_win_container_id=` + eachWin + `>
            //         <div class="win_check_icon date_range_input_start">
            //             <input type="checkbox" win_id="` + eachWin + `" class="win-checkbox-input">
            //         </div>
            //         <div class="win_id">
            //             <p class="post_id_text">` + eachWin + `</p>
            //         </div>
            //         <div class="win_value_box">
            //             <p class="win_value_box_text posts_wins_win_type">` + currentPostsWins[postID][eachWin]["win_type"] + `</p>
            //         </div>
            //         <div class="win_value_box date_range_input_end">
            //             <p class="win_value_box_text posts_wins_prize_type">$` + currentPostsWins[postID][eachWin]["prize_money"] + `</p>
            //         </div>
            //     </div>`




            //     )



                
            // };
            



        }
        








    }
    else {
        $(`[post_win_card_container_id=` + postID + `]`).remove()
        
    }

    checkIfEmptyPostsWins()
    




})





function mark_as_winner(post_id, is_won) {
    currentPostIndex = getPostFromCurrentPosts(post_id)[3]
    currentPosts[currentPostIndex]["is_winner"] = is_won
}









$("#export_csv").click(function(){

    var selected_post_ids = []

    var exportPosts = false
    var exportWins = false
    var winType = null




    $(".post-checkbox-input").each(function () {

        if ($(this).prop("checked") == true) {
            selected_post_ids.push($(this).attr("post_id"))
        }



    })

    if (selected_post_ids.length == 0) {
        showAlert("No Posts Selected", "alert-danger")
        return
    }







    if ($("#export_posts_checkbox").prop("checked") == true) {
        exportPosts = true
    }

    if ($("#export_wins_checkbox").prop("checked") == true) {
        exportWins = true

        $(".win_type_export_option").each(function () {
            if ($(this).prop("checked") == true) {
                winType = $(this).val()
            }



        })


    }

    if (winType == "All_Wins") {
        winType = ""
    }


    if (exportPosts == false && exportWins == false) {
        showAlert("Select 'Export Posts' or 'Export Wins' or Both.", "alert-danger")
        return
    }

    console.log(exportPosts)
    console.log(exportWins)
    console.log(winType)
    console.log(selected_post_ids)



    socket.send(JSON.stringify({
        'post_ids': selected_post_ids,
        'export_posts': exportPosts,
        'export_wins': exportWins,
        'win_type': winType,
        "prize_money": ""
    }));




























})










$("#delete_wins").click(function(){

    var selectedWinIDs = []


    $(".win-checkbox-input:checked").each(function () {
        selectedWinIDs.push($(this).attr("win_id"))
    })

    if (selectedWinIDs.length == 0) {
        showAlert("No Posts Selected", "alert-danger")
        return
    }


    $.ajax({
        url: origin + "/wins/delete/",
        type: 'post',
        data: {
            win_ids: selectedWinIDs,
            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("FAIL. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            response.data["successfulWins"].forEach(win => {

                delete currentPostsWins[win["post_id"]][win["win_id"]]

                if ($.isEmptyObject(currentPostsWins[win["post_id"]])) {
                    $(`[post_win_card_container_id=` + win["post_id"] + `]`).remove()

                    specificElems = []

                    currentPostContainer = $(`[post_box_id=` + win["post_id"] + `]`)
                    specificElems.push(currentPostContainer.find(`.post_check_icon`))
                    specificElems.push(currentPostContainer.find(`.post_id`))
                    specificElems.push(currentPostContainer.find(`.post_id_text`))
                    specificElems.push(currentPostContainer.find(`.post_username`))
                    specificElems.push(currentPostContainer.find(`.post_username_text`))

                    specificElems.forEach(element => {
                        element.removeClass("win_color")
                    });


                    specificCheckBox = $(`[post_id=` + win["post_id"] + `]`)

                    specificCheckBox.addClass("is_NOT_winner")
                    specificCheckBox.removeClass("is_winner")
                    mark_as_winner(win["post_id"], false)





                    }
                else {

                    removeAllPostWinsInsideCard(win["post_id"])
                    createPostWinsInsideCard(win["post_id"])






                }

            });

            showAlert("Wins DELETED Successfully", "alert-success")

            response.data["failedWins"].forEach(failedWin => {
                showAlert(failedWin[0] + ": " + failedWin[1])
            });









        }
    
    
    
    
    })

    checkIfEmptyPostsWins()












})







$("#edit_wins").click(function(){

    var selectedWinIDs = []


    $(".win-checkbox-input:checked").each(function () {

        selectedWinIDs.push($(this).attr("win_id"))
    })

    var winInputValue = $("#edit_win_input").val()
    var prizeInputValue = $("#prize_money_edit_win_input").val()

    if (selectedWinIDs.length == 0) {
        showAlert("No Posts Selected", "alert-danger")
        return
    }
    if (prizeInputValue < 0) {
        showAlert("Prize Less Than 0", "alert-danger")
        return
    }





    $.ajax({
        url: origin + "/wins/update/",
        type: 'post',
        data: {
            win_ids: selectedWinIDs,
            win_type: winInputValue,
            prize_money: prizeInputValue,
            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("FAIL. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            

            response.data["successfulWins"].forEach(win => {
                console.log(currentPostsWins)
                console.log(win["post_id"])
                console.log(win["win_id"])
                currentPostsWins[win["post_id"]][win["win_id"]]["win_type"] = win["win_type"]
                currentPostsWins[win["post_id"]][win["win_id"]]["prize_money"] = win["prize_money"]



                removeAllPostWinsInsideCard(win["post_id"])
                createPostWinsInsideCard(win["post_id"])






            });

            showAlert("Wins Edited Successfully", "alert-success")

            response.data["failedWins"].forEach(failedWin => {
                showAlert(failedWin[0] + ": " + failedWin[1])
            });









        }
    
    
    
    
    })










})











$("#add_wins").click(function(){

    var selectedPostIDs = []
    var prizeInputValue = $("#prize_money_add_win_input").val()
    var win_type = $("#add_win_input").val()


    $(".post-checkbox-input:checked").each(function () {
        selectedPostIDs.push($(this).attr("post_id"))
    })

    if (selectedPostIDs.length == 0) {
        showAlert("No Posts Selected", "alert-danger")
        return
    }

    if (prizeInputValue < 0) {
        showAlert("Prize Less Than 0", "alert-danger")
        return
    }





    $.ajax({
        url: origin + "/wins/create/",
        type: 'post',
        data: {
            post_ids: selectedPostIDs,
            win_type: win_type,
            prize_money: prizeInputValue,
            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("FAIL. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){

            var currentPost = null
            var postUsername = null
            var postTweetID = null
            var postTelegramID = null



            response.data["successfulWins"].forEach(win => {



                if ($.isEmptyObject(currentPostsWins[win["id"]])) {

                    currentPostsWins[win["id"]][win["win_id"]] = {"win_type": win["win_type"], "prize_money": win["prize_money"]}

                    currentPost = getPostFromCurrentPosts(win["id"])
                    postUsername = currentPost[0]
                    postTweetID = currentPost[1]
                    postTelegramID = currentPost[2]
                    

                    specificElems = []

                    currentPostContainer = $(`[post_box_id=` + win["id"] + `]`)
                    specificElems.push(currentPostContainer.find(`.post_check_icon`))
                    specificElems.push(currentPostContainer.find(`.post_id`))
                    specificElems.push(currentPostContainer.find(`.post_id_text`))
                    specificElems.push(currentPostContainer.find(`.post_username`))
                    specificElems.push(currentPostContainer.find(`.post_username_text`))

                    specificElems.forEach(element => {
                        element.addClass("win_color")
                    });


                    specificCheckBox = $(`[post_id=` + win["id"] + `]`)

                    specificCheckBox.addClass("is_winner")
                    specificCheckBox.removeClass("is_NOT_winner")

                    mark_as_winner(win["id"], true)




                    createPostWinsCard(win["id"], postUsername, postTelegramID, postTweetID)
                    createPostWinsInsideCard(win["id"])





                    }
                else {
                    currentPostsWins[win["id"]][win["win_id"]] = {"win_type": win["win_type"], "prize_money": win["prize_money"]}

                    removeAllPostWinsInsideCard(win["id"])
                    createPostWinsInsideCard(win["id"])






                }

            });

            showAlert("Wins Created Successfully", "alert-success")

            response.data["failedWins"].forEach(failedWin => {
                showAlert(failedWin[0] + ": " + failedWin[1])
            });









        }
    
    
    
    
    })












})



















