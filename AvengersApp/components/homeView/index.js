'use strict';

app.homeView = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_homeView
// END_CUSTOM_CODE_homeView
(function (parent) {
    var dataProvider = app.data.avengersAppBackend,
        flattenLocationProperties = function (dataItem) {
            var propName, propValue,
                isLocation = function (value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        // Location type property
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Licenses',
                dataProvider: dataProvider
            },

            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'usrl_product': {
                            field: 'usrl_product',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: 50
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        homeViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function (e) {
                app.mobileApp.navigate('#components/homeView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function (e) {
                var item = e.view.params.uid,
                    dataSource = homeViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item),
                    test1 = "Days left to expire:",
                    test2;
                // if (!itemModel.usrl_product) {
                //itemModel.usrl_product = String.fromCharCode(160);
                // }
                var daysLeft = 0;
                if (itemModel.usrl_deactive_date) {
                    var date1 = new Date();
                    var date2 = itemModel.usrl_deactive_date;
                    var timeDiff = date2.getTime() - date1.getTime();
                    daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    if (daysLeft < 0) {
                        daysLeft = 0;
                    }
                }
                test2 = daysLeft;
                homeViewModel.set('currentItem', itemModel);
                homeViewModel.set('name', test1);
                homeViewModel.set('name2', test2)
            },
            currentItem: null,
            name: null,
            name2: null,
            color: "red"
        });

    parent.set('homeViewModel', homeViewModel);
})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
// END_CUSTOM_CODE_homeViewModel