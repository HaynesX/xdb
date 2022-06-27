
var csrf_token = $("input[name=csrfmiddlewaretoken]").val()
var origin   = window.location.origin;
viewAllWinsModal = $("#viewAllWinsModal")

// Bootstrap-Similar ShowAlert Function
function showAlert(text, type) {
    $('#alert').attr("class", "alert " + type)
    $('#alert').fadeIn(800)
    $('#alert').text(text)
    setTimeout( function() { $('#alert').fadeOut(1000); }, 1000);
}



function verifyWin(win_type, prize_money, transaction_hash, winTypeLabelElems, prizeMoneyLabelElems, transactionHashLabelElems){
    prize_money = parseInt(prize_money)
    var win_types = ["Random Draw", "Soldier of the Month", "Tweet of the Week"]

    if (win_types.indexOf(win_type) == -1) {
        winTypeLabelElems.forEach(element => {
            element.css("color", "red")
            showAlert("Please select a valid Win Type.", "alert-danger")
        });
        return false
    } 

    if (prize_money == '' || prize_money < 0 || prize_money >= 9999999 || Number.isNaN(prize_money)) {
        prizeMoneyLabelElems.forEach(element => {
            element.css("color", "red")
            showAlert("Please input a valid amount of Prize Money.", "alert-danger")
        });
        return false
    }

    if (transaction_hash != '' && !(transaction_hash.startsWith("https://"))) {
        transactionHashLabelElems.forEach(element => {
            element.css("color", "red")
            showAlert("Please input a VALID URL for the Transaction Hash. (Must begin with 'https://')", "alert-danger")
        });
        return false
    }

    return true

}




function changeAnnouncementText(username=null, date=null, prize=null, postCount=null) {
    if(username != null){
        $(".announcement-post-username").each(function() {
            $(this).text(username)
        });
    }

    if(date != null){
        $(".announcement-post-date").each(function() {
            $(this).text(date)
        });
    }


    if(prize != null){
        $(".announcement-post-prize").each(function() {
            $(this).text(prize)
        });
    }

    if(postCount != null){
        $(".announcement-post-count").each(function() {
            $(this).text(postCount)
        });
    }
}




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


// init Isotope
var $grid = $('.portfolio-grid').isotope({
    itemSelector: '.element-item',
});

// filter functions
var filterFns = {
    // show if number is greater than 50
    numberGreaterThan50: function () {
        var number = $(this).find('.number').text();
        return parseInt(number, 10) > 50;
    },
    // show if name ends with -ium
    ium: function () {
        var name = $(this).find('.name').text();
        return name.match(/ium$/);
    }
};

// bind filter button click
$('#filters').on('click', 'a', function () {
    var filterValue = $(this).attr('data-filter');
    // use filterFn if matches value
    filterValue = filterFns[filterValue] || filterValue;
    $grid.isotope({ filter: filterValue });
});

// bind sort button click
$('#sorts').on('click', 'a', function () {
    var sortByValue = $(this).attr('data-sort-by');
    $grid.isotope({ sortBy: sortByValue });
});

// change is-checked class on buttons
$('.filters-btn').each(function (i, buttonGroup) {
    var $buttonGroup = $(buttonGroup);
    $buttonGroup.on('click', 'a', function () {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
    });
});












$(document).on('click','.date',function(){
    var content = $(this).parent().find(".posts-content-container")[0]
    var contentButtons = $(this).parent().find(".button-section-posts")[0]
    var buttons = $(this).parent().find(".btn-posts")
    
    if ( content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }

    if ( contentButtons.style.maxHeight) {
        for (let index = 0; index < buttons.length; index++) {
            var element = buttons[index];
            element.style.display = "none";
        }
        contentButtons.style.maxHeight = null;
        contentButtons.style.paddingBottom = "0em";
        contentButtons.style.paddingTop = "0em";
        contentButtons.style.borderTopWidth = "0px";
        document.getElementById($(this).attr("id")).scrollIntoView();
        
        
    } else {
        contentButtons.style.paddingTop = "3em";
        contentButtons.style.paddingBottom = "5em";
        contentButtons.style.borderTopWidth = "0.5px"
        contentButtons.style.maxHeight = content.scrollHeight + "px";

        for (let index = 0; index < buttons.length; index++) {
            var element = buttons[index];
            element.style.display = "inline-block";
        }

        document.getElementById($(this).attr("id")).scrollIntoView();
    }
});


var modal = document.getElementById("myModal");


var modalContainer = document.getElementById("modalContainer");


$(document).on('click','.win-button',function(){
    modal.style.display = "flex";
    var postID = $(this).parent().parent().attr('id')
    $(modal).attr("post_id", postID)



})





$(document).mouseup(function(e) 
{
    var container = $(modalContainer);
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        modal.style.display = "none";
    }
});



$(document).mouseup(function(e) 
{
    var container = $("#announcements-modal-container");
    var modal = $("#announcements-modal")
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        modal.css("display", "none")
    }
});





$(document).mouseup(function(e) 
{
    var container = $("#flags-modal-container")
    var modal = $("#flags-modal")
    var post_id = modal.attr("current_flag_post_id")
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        modal.css("display", "none")
        $(`[flag_post_id=` + post_id + `]`).css("display", "none")
    }
});






$(document).on('click','.flags-button',function(){
    var post_id = $(this).attr('flag_post_button_id')
    $("#flags-modal").css("display", "flex")
    $("#flags-modal").attr("current_flag_post_id", post_id)
    $(`[flag_post_id=` + post_id + `]`).css("display", "flex")
    

})







$(document).mouseup(function(e) 
{
    var container = $("#mentions-modal-container")
    var modal = $("#mentions-modal")
    var post_id = modal.attr("current_mention_post_id")
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        modal.css("display", "none")
        $(`[mention_post_id=` + post_id + `]`).css("display", "none")
    }
});



$(document).mouseup(function(e) 
{
    var container = $("#viewWinsModalContainer");
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        var post_id = $("#viewWinsModalContainer").attr("current_win_elems_id")
        $("#wins-elems--" + post_id).css("display", "none")
        $("#viewAllWinsModal").css('display', 'none');
    }
});






$(document).on('click','.mentions-button',function(){
    var post_id = $(this).attr('mention_post_button_id')
    $("#mentions-modal").css("display", "flex")
    $("#mentions-modal").attr("current_mention_post_id", post_id)
    $(`[mention_post_id=` + post_id + `]`).css("display", "flex")
    

})





$(document).on('click','.win-type-option',function(){
    var win_type_elem = $("#win-type")
    win_type_elem.removeAttr("open", null)
    $("#win-type-label").css("color", "")
    win_type_elem.attr("win-type", $(this).attr("title"))

})






$("#prize_money").on("input", function() {
    $("#prize-money-label").css("color", "")
})

$("#transaction_hash").on("input", function() {
    $("#transaction-hash-label").css("color", "")
})


$(".form__input_editWin").on("input", function() {
    $("#prize-money-column-header").css("color", "")
    $(this).parent().parent().css("color", "")
})

$(".form__input_editWin-transaction").on("input", function() {
    $("#transaction-column-header").css("color", "")
    $(this).parent().parent().css("color", "")
})







$(document).on('click','.win-button-winner',function(){
    var post_id = $(this).attr('win_button_id')
    $("#viewAllWinsModal").css("display", "flex")
    $("#viewWinsModalContainer").attr("current_win_elems_id", post_id)
    $("#wins-elems--" + post_id).css("display", '')
})





$(document).on('click','#addWinButtonModal',function(){

    
    var win_type = $("#win-type").attr("win-type")
    var prizeMoney = $("#prize_money").val()
    var transactionHash = $("#transaction_hash").val()

    if (verifyWin(win_type, prizeMoney, transactionHash, [$("#win-type-label")], [$("#prize-money-label")], [$("#transaction-hash-label")]) == false) {
        return
    }
    

    $.ajax({
        url: origin + "/posts/win/",
        type: 'post',
        data: {
            post_id: $("#myModal").attr('post_id'),
            win_type: win_type,
            prize_money: prizeMoney,
            transaction_hash: transactionHash,
            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("Win not added. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            modal.style.display = "none";
            var winsContainer = $("#wins-elems--" + $("#myModal").attr('post_id'))

            if (winsContainer.children('tr').length == 0) {
                var winTransaction = "N/A"

                if((response.data["transaction_hash"] != null) && (response.data["transaction_hash"] != '')){
                    winTransaction = response.data["transaction_hash"]
                }
                winsContainer.append($(`

                <tr win_row_id=` + response.data["win_id"] + `>
                                        
                <td scope="row" data-label="Win Type" class="win-type-edit-value" id="win-type-edit-value--` + response.data["win_id"] + `">` + response.data["win_type"] + `</td>
                <td data-label="Prize Money" class="win-prize-edit-value" id="prize-money-edit-value--` + response.data["win_id"] + `">` + response.data["prize_money"] + `</td>
                <td data-label="Transaction" class="win-transaction-edit-value" id="transaction-edit-value--` + response.data["win_id"] + `">` + winTransaction + `</td>
                <td scope="row" data-label="Win Type" class="win-type-edit-section" id="win-type-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <div class="select" tabindex="1">
                          </div>
                    </div>
                </td>





                <td data-label="Prize Money" class="prize-money-edit-section" id="prize-money-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <input type="number" class="form__input_editWin" min="0" max="9999999">
                    </div>
                </td>





                <td data-label="Transaction" class="transaction-edit-section" id="transaction-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <input type="text" class="form__input_editWin-transaction">
                    </div>
                </td>






                <td data-label="Action" class="actions-edit-value" id="actions-edit-value--` + response.data["win_id"] + `">
                    <div class="win-input-flex-buttons">
                        <div class="buttons-edit-win">
                        <i style="font-size:22px; color:black; " class="fa edit-win-button" id="edit-win-button" win_id="` + response.data["win_id"] + `">&#xf044;</i>
                        <i style="font-size:24px; color:red; " class="fa delete-win-button" id="delete-win-button" win_id="` + response.data["win_id"] + `">&#xf00d;</i>
                        </div>
                    </div>
                </td>









                <td data-label="Action" class="action-edit-section" id="win-action-buttons--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex-buttons">
                        <div class="buttons-edit-win">
                            <i style="font-size:24px; color:rgb(255, 98, 0); " class="fa delete-win-changes-button" id="delete-win-changes-button" win_id="` + response.data["win_id"] + `">&#xf00d;</i>
                            <i style="font-size:24px; color:rgb(64, 255, 0); " class="fa update-win-changes-button" id="update-win-changes-button" win_id="` + response.data["win_id"] + `">&#xf00c;</i>
                       
                        </div>
                    </div>
                </td>





              </tr>
                `))

                var cardSection = $("[card_actions_id=" + $("#myModal").attr('post_id') + "]")
                cardSection.prepend($(`
                <div class="win-button-winner win-color" win_button_id="` + $("#myModal").attr('post_id') + `"><p class="font-sans lower-text card-action-size card-button-icon">🌟</p></div>
                `))

                $(`#` + $("#myModal").attr('post_id')).find('*').each(function(){
                    if(!($(this).hasClass("card-button-icon"))){
                        $(this).addClass("win-color");
                    }
                });

                $(`[tweet_button_id=` + $("#myModal").attr('post_id') + `]`).addClass("win-button-winner-pre-won")
                $(`[card_tweet_text_id=` + $("#myModal").attr('post_id') + `]`).addClass("card-tweet-text-container-win")
                $(`[border_card_section_one=` + $("#myModal").attr('post_id') + `]`).addClass("border-card-section-winner")
                $(`[card_top_buttons_id=` + $("#myModal").attr('post_id') + `]`).addClass("border-card-section-winner")
                $(`[card_actions_id=` + $("#myModal").attr('post_id') + `]`).addClass("border-card-section-winner")
                $(`[mark_as_winner_id=` + $("#myModal").attr('post_id') + `]`).addClass("win-button-winner-pre-won")
                $(`[mark_as_winner_id=` + $("#myModal").attr('post_id') + `]`).removeClass("win-button-radius")
                $(`[announce_winner_id=` + $("#myModal").attr('post_id') + `]`).addClass("announce-button-winner")

                showAlert("Win Added Successfully!", "alert-success")
                
            } else {

                if (response.data["winning_transaction"] == null) {
                winsContainer.append($(`
                <tr win_row_id=` + response.data["win_id"] + `>
                                        
                <td scope="row" data-label="Win Type" class="win-type-edit-value" id="win-type-edit-value--` + response.data["win_id"] + `">` + response.data["win_type"] + `</td>
                <td data-label="Prize Money" class="win-prize-edit-value" id="prize-money-edit-value--` + response.data["win_id"] + `">` + response.data["prize_money"] + `</td>
                <td data-label="Transaction" class="win-transaction-edit-value" id="transaction-edit-value--` + response.data["win_id"] + `">` + "N/A" + `</td>
                <td scope="row" data-label="Win Type" class="win-type-edit-section" id="win-type-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <div class="select" tabindex="1">
                          </div>
                    </div>
                </td>





                <td data-label="Prize Money" class="prize-money-edit-section" id="prize-money-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <input type="number" class="form__input_editWin" min="0" max="9999999">
                    </div>
                </td>





                <td data-label="Transaction" class="transaction-edit-section" id="transaction-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <input type="text" class="form__input_editWin-transaction">
                    </div>
                </td>






                <td data-label="Action" class="actions-edit-value" id="actions-edit-value--` + response.data["win_id"] + `">
                    <div class="win-input-flex-buttons">
                        <div class="buttons-edit-win">
                        <i style="font-size:22px; color:black; " class="fa edit-win-button" id="edit-win-button" win_id="` + response.data["win_id"] + `">&#xf044;</i>
                        <i style="font-size:24px; color:red; " class="fa delete-win-button" id="delete-win-button" win_id="` + response.data["win_id"] + `">&#xf00d;</i>
                        </div>
                    </div>
                </td>









                <td data-label="Action" class="action-edit-section" id="win-action-buttons--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex-buttons">
                        <div class="buttons-edit-win">
                            <i style="font-size:24px; color:rgb(255, 98, 0); " class="fa delete-win-changes-button" id="delete-win-changes-button" win_id="` + response.data["win_id"] + `">&#xf00d;</i>
                            <i style="font-size:24px; color:rgb(64, 255, 0); " class="fa update-win-changes-button" id="update-win-changes-button" win_id="` + response.data["win_id"] + `">&#xf00c;</i>
                       
                        </div>
                    </div>
                </td>





              </tr>


                `))

                }
                else{
                    winsContainer.append($(`
                <tr win_row_id=` + response.data["win_id"] + `>
                                        
                <td scope="row" data-label="Win Type" class="win-type-edit-value" id="win-type-edit-value--` + response.data["win_id"] + `">` + response.data["win_type"] + `</td>
                <td data-label="Prize Money" class="win-prize-edit-value" id="prize-money-edit-value--` + response.data["win_id"] + `">` + response.data["prize_money"] + `</td>
                <td data-label="Transaction" class="win-transaction-edit-value" id="transaction-edit-value--` + response.data["win_id"] + `">` + response.data["winning_transaction"] + `</td>
                <td scope="row" data-label="Win Type" class="win-type-edit-section" id="win-type-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <div class="select" tabindex="1">
                          </div>
                    </div>
                </td>





                <td data-label="Prize Money" class="prize-money-edit-section" id="prize-money-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <input type="number" class="form__input_editWin" min="0" max="9999999">
                    </div>
                </td>





                <td data-label="Transaction" class="transaction-edit-section" id="transaction-edit-section--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex">
                        <input type="text" class="form__input_editWin-transaction">
                    </div>
                </td>






                <td data-label="Action" class="actions-edit-value" id="actions-edit-value--` + response.data["win_id"] + `">
                    <div class="win-input-flex-buttons">
                        <div class="buttons-edit-win">
                        <i style="font-size:22px; color:black; " class="fa edit-win-button" id="edit-win-button" win_id="` + response.data["win_id"] + `">&#xf044;</i>
                        <i style="font-size:24px; color:red; " class="fa delete-win-button" id="delete-win-button" win_id="` + response.data["win_id"] + `">&#xf00d;</i>
                        </div>
                    </div>
                </td>









                <td data-label="Action" class="action-edit-section" id="win-action-buttons--` + response.data["win_id"] + `" style="display: none">
                    <div class="win-input-flex-buttons">
                        <div class="buttons-edit-win">
                            <i style="font-size:24px; color:rgb(255, 98, 0); " class="fa delete-win-changes-button" id="delete-win-changes-button" win_id="` + response.data["win_id"] + `">&#xf00d;</i>
                            <i style="font-size:24px; color:rgb(64, 255, 0); " class="fa update-win-changes-button" id="update-win-changes-button" win_id="` + response.data["win_id"] + `">&#xf00c;</i>
                       
                        </div>
                    </div>
                </td>





              </tr>
                `))

                }

                winElemsElement = $(".win-elems")

                if (response.data["winning_transaction"] == null) {
                    winElemsElement.append($(`
                <div win_id="` + $("#myModal").attr('post_id') + `">
                                                <div class="win_type_value" id="win_type--` + response.data["win_id"] + `">` + response.data["win_type"] + `</div>
                                                <div class="win_amount_value" id="win_amount--` + response.data["win_id"] + `">` + response.data["prize_money"] + `</div>
                                                <div class="win_transaction_value" id="win_transaction--` + response.data["win_id"] + `">` + "N/A" + `</div>
                                            </div>
                
                
                
                `))
                    
                } else {
                    winElemsElement.append($(`
                <div win_id="` + $("#myModal").attr('post_id') + `">
                                                <div class="win_type_value" id="win_type--` + response.data["win_id"] + `">` + response.data["win_type"] + `</div>
                                                <div class="win_amount_value" id="win_amount--` + response.data["win_id"] + `">` + response.data["prize_money"] + `</div>
                                                <div class="win_transaction_value" id="win_transaction--` + response.data["win_id"] + `">` + response.data["winning_transaction"] + `</div>
                                            </div>
                
                
                
                `)) 
                }



                showAlert("Win Added Successfully!", "alert-success")


                
                
            }

        }
    })

})








$(document).on('click','.remove-button',function(){
    var post_id = $(this).attr("delete_post_id")

    var postElement = $("#" + post_id) // The CARD
    var postsContainer = postElement.parent() // The Containers holding all the CARDS
    var dateDropdownContainer = postsContainer.parent() // The element of the entire Date (Day). 
    var datesSection = dateDropdownContainer.parent() // This shows all the dateDropdownContainers. 


    $.ajax({
        url: origin + "/posts/delete",
        type: 'post',
        data: {
            post_id: post_id,
            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("Post not deleted. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){

            if (postsContainer.children().length > 1) {
                postElement.remove()
                showAlert("Post " + post_id + " Deleted Successfully", "alert-success")
            } else {
                if (datesSection.children().length > 1) {
                    dateDropdownContainer.remove()
                } else {
                    location.reload() 
                }
            }
        }
    })
})







$(document).on('click','.delete-win-button',function(){

    win_id = $(this).attr('win_id')
    $.ajax({
        url: origin + "/posts/win/delete",
        type: 'post',
        data: {
            win_id: win_id,
            csrfmiddlewaretoken: csrf_token
        },
        error: function (response) { 
            showAlert("Win not deleted. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            var currentPostID = $("#viewWinsModalContainer").attr('current_win_elems_id')
            var winsContainer = $("#wins-elems--" + currentPostID)

            if (winsContainer.children('tr').length == 1) {
                winsContainer.empty()
                $("#viewAllWinsModal").css("display", "none")

                $(`[tweet_button_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).removeClass("win-button-winner-pre-won")
                $(`[tweet_button_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).addClass("tweet-button")
                $(`[card_tweet_text_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).removeClass("card-tweet-text-container-win")
                $(`[card_tweet_text_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).addClass("card-tweet-text-container")
                
                $(`[border_card_section_one=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).removeClass("border-card-section-winner")
                $(`[card_top_buttons_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).removeClass("border-card-section-winner")
                $(`[card_top_buttons_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).addClass("border-card-section")
                $(`[card_actions_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).removeClass("border-card-section-winner")
                $(`[card_actions_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).addClass("border-card-section")

                $(`[mark_as_winner_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).removeClass("win-button-winner-pre-won")
                $(`[mark_as_winner_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).addClass("win-button-radius")
                $(`[announce_winner_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).removeClass("announce-button-winner")
                $(`[announce_winner_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).addClass("announce-button")

                $(`[win_button_id=` + $("#viewWinsModalContainer").attr('current_win_elems_id') + `]`).remove()

                $(`#` + currentPostID).find('*').each(function(){
                    $(this).removeClass("win-color");
                    
                });
            }
            else{
                $(`[win_row_id=` + win_id + `]`).remove()
            }
            
            showAlert("Win Deleted Successfully!", "alert-success")
           
        }
    })
})











$(document).on('click','.edit-win-button',function(){
    win_id = $(this).attr('win_id')

    current_win_type = $("#win-type-edit-value--" + win_id).text() // Can Change This Line Of Code
    current_prize_money = $("#prize-money-edit-value--" + win_id).text() // Can Change This Line Of Code
    current_transaction = $("#transaction-edit-value--" + win_id).text() // Can Change This Line Of Code

    $("#win-type-edit-value--" + win_id).css("display", "none")
    $("#prize-money-edit-value--" + win_id).css("display", "none")
    $("#transaction-edit-value--" + win_id).css("display", "none")
    $("#actions-edit-value--" + win_id).css("display", "none")


    win_type_options_div = $("#win-type-edit-section--" + win_id).find(".select").first()
    
    switch(current_win_type) {
        case "Random Draw":
            win_type_options_div.append($('<input class="selectopt input-win" name="test" type="radio" id="opt1" checked><label for="opt1" class="option">Random Draw</label><input class="selectopt input-win" name="test" type="radio" id="opt2"><label for="opt2" class="option">Soldier of the Month</label><input class="selectopt input-win" name="test" type="radio" id="opt3"><label for="opt3" class="option">Tweet of the Week</label>'))
          break;
        case "Soldier of the Month":
            win_type_options_div.append($('<input class="selectopt input-win" name="test" type="radio" id="opt1" checked><label for="opt1" class="option">Soldier of the Month</label><input class="selectopt input-win" name="test" type="radio" id="opt2"><label for="opt2" class="option">Random Draw</label><input class="selectopt input-win" name="test" type="radio" id="opt3"><label for="opt3" class="option">Tweet of the Week</label>'))
          break;
        case "Tweet of the Week":
            win_type_options_div.append($('<input class="selectopt input-win" name="test" type="radio" id="opt1" checked><label for="opt1" class="option">Tweet of the Week</label><input class="selectopt input-win" name="test" type="radio" id="opt2"><label for="opt2" class="option">Random Draw</label><input class="selectopt input-win" name="test" type="radio" id="opt3"><label for="opt3" class="option">Soldier of the Month</label>'))
            break;
      }


    $("#prize-money-edit-section--" + win_id).find('input').val(current_prize_money)
    if (current_transaction == "" || current_transaction == "N/A") {
        $("#transaction-edit-section--" + win_id).find('input').val("")
    } else {
        $("#transaction-edit-section--" + win_id).find('input').val(current_transaction)
    }

    $("#win-type-edit-section--" + win_id).css("display", '')
    $("#prize-money-edit-section--" + win_id).css("display", '')
    $("#transaction-edit-section--" + win_id).css("display", '')
    $("#win-action-buttons--" + win_id).css("display", '')


})


$(document).on('click','.delete-win-changes-button',function(){
    win_id = $(this).attr('win_id')
    win_type_options_div = $("#win-type-edit-section--" + win_id).find(".select").first().empty()

    $("#win-type-edit-section--" + win_id).css('color', '')
    $("#prize-money-edit-section--" + win_id).css('color', '')
    $("#transaction-edit-section--" + win_id).css('color', '')

    $("#win-type-column-header").css('color', '')
    $("#prize-money-column-header").css('color', '')
    $("#transaction-column-header").css('color', '')


    $("#win-type-edit-section--" + win_id).css("display", 'none')
    $("#prize-money-edit-section--" + win_id).css("display", 'none')
    $("#transaction-edit-section--" + win_id).css("display", 'none')
    $("#win-action-buttons--" + win_id).css("display", 'none')

    $("#win-type-edit-value--" + win_id).css("display", '')
    $("#prize-money-edit-value--" + win_id).css("display", '')
    $("#transaction-edit-value--" + win_id).css("display", '')
    $("#actions-edit-value--" + win_id).css("display", '')

})


$(document).on('click','.update-win-changes-button',function(){
    win_id = $(this).attr('win_id')

    current_win_type = $("#win-type-edit-value--" + win_id).text() // Can Change This Line Of Code
    current_prize_money = $("#prize-money-edit-value--" + win_id).text() // Can Change This Line Of Code
    current_transaction = $("#transaction-edit-value--" + win_id).text() // Can Change This Line Of Code

    win_type_options_div = $("#win-type-edit-section--" + win_id).find(".select").first()

    firstLabel = win_type_options_div.find('label')[0]
    secondLabel = win_type_options_div.find('label')[1]
    thirdLabel = win_type_options_div.find('label')[2]

    isBefore = window.getComputedStyle(firstLabel,':before').position
    if (isBefore == "absolute") {
        win_type = $(firstLabel).text()
    } else if(window.getComputedStyle(secondLabel,':before').position == "absolute") {
        win_type = $(secondLabel).text()   
    }
    else{
        win_type = $(thirdLabel).text()
    }

    prizeMoney = $("#prize-money-edit-section--" + win_id).find('input').val()
    transactionHash = $("#transaction-edit-section--" + win_id).find('input').val()

    if ((current_win_type == win_type) && (parseInt(current_prize_money) == parseInt(prizeMoney))) {

        if( (current_transaction == transactionHash) || (current_transaction == "N/A" && transactionHash == "") || (current_transaction == "N/A" && transactionHash == "N/A")){
            $(".delete-win-changes-button").click()
            return
        }
    }

    win_type_options_sec = $("#win-type-edit-section--" + win_id)
    prize_money_sec = $("#prize-money-edit-section--" + win_id)
    transaction_sec = $("#transaction-edit-section--" + win_id)

    win_type_column_header = $("#win-type-column-header")
    prize_money_column_header = $("#prize-money-column-header")
    transaction_column_header = $("#transaction-column-header")

    if (verifyWin(win_type, prizeMoney, transactionHash, [win_type_options_sec, win_type_column_header], [prize_money_sec, prize_money_column_header], [transaction_sec, transaction_column_header]) == false) {
        return
    }

    $.ajax({
        url: origin + "/posts/win/update",
        type: 'post',
        data: {
            win_id: win_id,
            win_type: win_type,
            prize_money: prizeMoney,
            transaction_hash: transactionHash,
            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("Win not updated. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            $("#win-type-edit-value--" + win_id).text(response.data["win_type"])
            $("#prize-money-edit-value--" + win_id).text(response.data["prize_money"])
            if(response.data["winning_transaction"] == "" || response.data["winning_transaction"] == null){
                $("#transaction-edit-value--" + win_id).text("N/A")
            }
            else {
                $("#transaction-edit-value--" + win_id).text(response.data["winning_transaction"])
            }
            
            $(".delete-win-changes-button").click()
            showAlert("Win Edited Successfully!", "alert-success")
        }
    })

})

$(document).on('click','.announcebtnwin',function(){
    switch ($(this).attr("id")) {
        case "Random_Draw_Text_Button":
            $("#Random_Draw_Text").css("display", "")
            $("#Tweet_of_the_Week_Text").css("display", "none")
            $("#Soldier_of_the_Month_Text").css("display", "none")

            $(".send-tg-message-button").attr("win_type_setting", "Random_Draw")

            break;
    
        case "Tweet_of_the_Week_Text_Button":
            $("#Random_Draw_Text").css("display", "none")
            $("#Tweet_of_the_Week_Text").css("display", "")
            $("#Soldier_of_the_Month_Text").css("display", "none")

            $(".send-tg-message-button").attr("win_type_setting", "Tweet_of_the_Week")

            break
        case "Soldier_of_the_Month_Text_Button":
            $("#Random_Draw_Text").css("display", "none")
            $("#Tweet_of_the_Week_Text").css("display", "none")
            $("#Soldier_of_the_Month_Text").css("display", "")

            $(".send-tg-message-button").attr("win_type_setting", "Soldier_of_the_Month")

            break
    }




})







$(document).on('click','.announce-button',function(){
    post_id = $(this).attr("announce_winner_id")

    var telegram_username = $(`[tg_username_text_id=` + post_id + `]`).text()
    var post_date = $(`[date_text_id=` + post_id + `]`).text()

    $("#announcements-modal").css("display", "flex")
    $("#tg_username_announcement_input").val(telegram_username)

    var dateElement = $("#" + post_date)

    var postsContainer = dateElement.find(".posts-content-container")

    var post_count = postsContainer.children().length

    changeAnnouncementText(telegram_username, post_date, "", post_count)

    $("#Random_Draw_Text").css("display", "")
    $("#Tweet_of_the_Week_Text").css("display", "none")
    $("#Soldier_of_the_Month_Text").css("display", "none")

    $(".send-tg-message-button").attr("win_type_setting", "Random_Draw")
})




$('#tg_username_announcement_input').bind('keyup keydown change', function (e) {    
    changeAnnouncementText(username=$(this).val())
})


$('#prize_money_announcement_input').bind('keyup keydown change', function (e) {    
    changeAnnouncementText(username=null, date=null, prize=$(this).val(), postCount=null)
})




















$(document).on('click','.send-tg-message-button',function(){
    var username = $("#tg_username_announcement_input").val()
    var prize = $("#prize_money_announcement_input").val()
    var date = $(".announcement-post-date").first().text()
    var postCount = $(".announcement-post-count").first().text()
    var win_type = $(".send-tg-message-button").attr("win_type_setting")
    
    $.ajax({
        url: origin + "/tgbot/make-telegram-announcement",
        type: 'post',
        data: {
            username: username,
            prize: prize,
            date: date,
            postCount: postCount,
            win_type: win_type,
            csrfmiddlewaretoken: csrf_token

        },
        error: function (response) { 
            showAlert("Announcement not made. Please make sure you are logged in and refresh the page.", "alert-danger")
         },
        success: function(response){
            showAlert("Telegram Message Sent to Price Chat Successfully!", "alert-success")
        }
    })



})



