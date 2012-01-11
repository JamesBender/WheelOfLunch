(function () {
    'use strict';
    // Uncomment the following line to enable first chance exceptions.
    Debug.enableFirstChanceException(true);
    var yelpApiId = "5oigTqOZe63uTLW-BY-KqQ";
    var items = [];
    var itemList;
    //var x;

    function YelpFailed(e) {
        var statuscode = e.status;
        return;
    }

    function ShowResturants(e) {
        var result = JSON.parse(e.responseText);
        
        for (var idx = 0; idx < result.businesses.length; idx++) {
            var currentBusiness = result.businesses[idx];

            var item = {
                resturantName: currentBusiness.name,
                resturantAddress: currentBusiness.address1,
                resturantPhone: currentBusiness.phone,
                smallAverageRatingImgURL: currentBusiness.rating_img_url_small,
                resturantPhoto: currentBusiness.photo_url,
                resturantUrl: currentBusiness.url,
                largeAverageRatingImgURL: currentBusiness.rating_img_url,
                averageRating: currentBusiness.avg_rating
            };

            item.Categories = [];

            if (currentBusiness.categories.length > 0) {
                item.topCategory = currentBusiness.categories[0].name;
                for (var a = 0, count = currentBusiness.categories.length; a < count; a++) {
                    item.Categories.push(currentBusiness.categories[a].name);
                }
            }
            else {
                item.topCategory = "n/a";                
            }

            item.Reviews = [];

            for (var reviewIdx = 0, reviewCount = currentBusiness.reviews.length; reviewIdx < reviewCount; reviewIdx++) {
                var currentReview = currentBusiness.reviews[reviewIdx];
                var review = {
                    date: currentReview.date,
                    user: currentReview.user_name,
                    rating: currentReview.rating_img_url_small,
                    text: currentReview.text_excerpt
                };
                item.Reviews.push(review);
            }

            items.push(item);
        }

        itemList = WinJS.UI.getControl(document.getElementById('rList'));
        itemList.dataSource = items;
        itemList.addEventListener("iteminvoked", itemInvoked);
        
        itemList.scrollTo(0);
        PopulateDetails(0);
        document.getElementById('spin').addEventListener("click", spin, false);
        return;
    }

    function spin() {
        var max = items.length;
        var idx = Math.floor(Math.random() * max);
        PopulateDetails(idx);
        itemList.scrollTo(idx);
    }

    function itemInvoked(e) {
        var x = e.detail.itemIndex;
        PopulateDetails(x);
    }
    function PopulateDetails(x)
    {
        var selected = items[x];

        var name = document.getElementById('mainRestName');
        var address = document.getElementById('address');
        var phone = document.getElementById('phone');
        var restImage = document.getElementById('restImage');
        var categories = document.getElementById('categories');
        var lgRatingImg = document.getElementById('lgRatingImg');
        var resturantUrl = document.getElementById('restUrl');

        name.innerText = selected.resturantName;
        address.innerText = selected.resturantAddress;
        phone.innerText = selected.resturantPhone;
        restImage.src = selected.resturantPhoto;
        lgRatingImg.src = selected.largeAverageRatingImgURL;
        resturantUrl.href = selected.resturantUrl;

        var categoryList = '';
        for (var idx = 0, count = selected.Categories.length; idx < count; idx++) {
            if (categoryList != '') {
                categoryList += ", ";
            }
            categoryList += selected.Categories[idx];
        }
        
        categories.innerText = categoryList;

        var reviewList = document.getElementById('reviews');

        var reviews = '';
        for (var reviewIdx = 0, reviewCount = selected.Reviews.length; reviewIdx < reviewCount; reviewIdx++) {
            var currentReview = selected.Reviews[reviewIdx];
            reviews += '<li>';
            reviews += '<div>Date: ' + currentReview.date + ' by ' + currentReview.user + '</div>';
            reviews += '<div>' + currentReview.text + '</div>';
            reviews += '<div><img src="' + currentReview.rating + '"/></div>';
            reviews += '<hr /></li>';
        }

        reviewList.innerHTML = reviews;
        return;
    }
    
    function GetLocation(loc) {
        var yelpApiCall = "http://api.yelp.com/" +
        "business_review_search?" +
        "num_biz_requested=50" +
        "&lat=" + loc.coordinate.latitude +
        "&long=" + loc.coordinate.longitude +
        "&radius=25" +
        "&ywsid=" + yelpApiId;

        WinJS.xhr({ url: yelpApiCall }).then(ShowResturants, YelpFailed);
    }

    WinJS.Application.onmainwindowactivated = function (e) {
        
    }    

    document.addEventListener("DOMContentLoaded", function (e) {
        WinJS.UI.processAll().then(function () {
            var geo = Windows.Devices.Geolocation;
            var locator = new geo.Geolocator();
            locator.getGeopositionAsync().then(GetLocation, function (e) { return; });
            
        });
    });

    WinJS.Application.start();
})();