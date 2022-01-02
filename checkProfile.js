module.exports.checkProfileIfCorrect = (
    url,
    age,
    response,
    handlebars,
    profile
) => {
    console.log(age, url);
    if (url !== null) {
        if (
            isNaN(age) &&
            !url.toLowerCase().startsWith("https://") &&
            !url.toLowerCase().startsWith("http://") &&
            url
        ) {
            response.render(handlebars, {
                profile,
                nichtgueltigNaN: true,
                nichtgueltigUrl: true,
            });
            return false;
        } else {
            age = Number(age);
            if (isNaN(age)) {
                response.render(handlebars, { profile, nichtgueltigNaN: true });
                return false;
            } else {
                if (
                    !url.toLowerCase().startsWith("http://") &&
                    !url.toLowerCase().startsWith("https://") &&
                    url
                ) {
                    response.render(handlebars, {
                        profile,
                        nichtgueltigUrl: true,
                    });
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
};

module.exports.checkProfileIfEmpty = (data) => {
    if (!data.age) {
        data.age = null;
    } else if (!data.city) {
        data.city = null;
    } else if (!data.url) {
        data.url = null;
    } else {
        return data;
    }
    return data;
};
