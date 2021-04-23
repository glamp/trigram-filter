// turn a string into n 'grams'. we also lowercase the grams.
function ngrams(aString, n) {
  var r = [];

  for (var j = 1; j <= n; j++) {
    for (var i = 0; i <= aString.toLowerCase().length - j; i++) {
      r.push(aString.toLowerCase().substring(i, i + j));
    }
  }

  return r;
}

// shamelessly copied this from stackoverflow
function intersect(array1, array2) {
  return array1.filter((value) => array2.includes(value));
}

const trigramFilter = (options, query, { n = 3, nReturn = 10, filterBy }) => {
  if (!query) {
    return options.slice(0, 1000);
  }

  function getOptionValue(option) {
    if (!filterBy) {
      return value;
    }
    return filterBy(option);
  }

  const inputTrigrams = ngrams(query, n);
  return (
    options
      // iterate over each option and compute intersect(ngram(search), all_color_ngrams)
      .map((option) => {
        const nMatches = intersect(
          inputTrigrams, // ngrams of search input (i.e. "crnflower")
          ngrams(getOptionValue(option), n) // ngrams of the option (i.e. "cornflowerblue")
        ).length;
        return {
          ...option,
          nMatches,
        };
      })
      // toss out anything that had no matches
      .filter(({ nMatches }) => nMatches > 0)
      // for sanity's sake we'll only display the top 10 results. we're going to
      // order by `nMatches`. in the event of a tie the shorter word wins.
      //
      // i.e. if we're searching for "blue" then "Blue" is #1 and "Green Blue" #2
      .sort((a, b) => {
        const diff = b.nMatches - a.nMatches;
        if (diff) {
          return diff;
        }
        // if they have the same number off matching trigrams, shorter one wins
        return getOptionValue(a).length - getOptionValue(b).length;
      })
      // return the top `nReturn`
      .slice(0, nReturn)
  );
};

export default trigramFilter;
