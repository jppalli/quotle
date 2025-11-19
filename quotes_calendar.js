// Each quote includes the original text, author, word indices for scrambling, and date

const quotesCalendar = [
    {
        "text": "New year, new beginnings.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 3],
        "date": "2025-01-01"
    },
    {
        "text": "January is the doorway to the year.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-01-02"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "wordIndices": [1, 2, 6, 9, 12],
        "date": "2025-01-03"
    },
    {
        "text": "Every new day is a chance to change your life.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 5, 8],
        "date": "2025-01-04"
    },
    {
        "text": "The journey of a thousand miles begins with a single step.",
        "author": "Lao Tzu",
        "wordIndices": [1, 4, 6, 10],
        "date": "2025-01-05"
    },
    {
        "text": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "author": "Winston Churchill",
        "wordIndices": [0, 4, 11, 13],
        "date": "2025-01-06"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "wordIndices": [1, 5, 6, 9],
        "date": "2025-01-07"
    },
    {
        "text": "Believe you can and you are halfway there.",
        "author": "Theodore Roosevelt",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-01-08"
    },
    {
        "text": "The best way to predict the future is to create it.",
        "author": "Peter Drucker",
        "wordIndices": [1, 4, 6, 9],
        "date": "2025-01-09"
    },
    {
        "text": "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 7, 11, 16],
        "date": "2025-01-10"
    },
    {
        "text": "The only way to make sense out of change is to plunge into it, move with it, and enjoy the dance.",
        "author": "Alan Watts",
        "wordIndices": [4, 8, 11, 18],
        "date": "2025-01-11"
    },
    {
        "text": "Life is either a daring adventure or nothing at all.",
        "author": "Helen Keller",
        "wordIndices": [0, 4, 5, 7],
        "date": "2025-01-12"
    },
    {
        "text": "You miss 100 percent of the shots you do not take.",
        "author": "Wayne Gretzky",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-01-13"
    },
    {
        "text": "The greatest wealth is to live content with little.",
        "author": "Plato",
        "wordIndices": [1, 2, 6, 8],
        "date": "2025-01-14"
    },
    {
        "text": "Success is to be measured not by wealth, but by the legacy you leave behind.",
        "author": "Unknown",
        "wordIndices": [0, 4, 7, 11],
        "date": "2025-01-15"
    },
    {
        "text": "The purpose of our lives is to be happy.",
        "author": "Dalai Lama",
        "wordIndices": [1, 4, 7, 8],
        "date": "2025-01-16"
    },
    {
        "text": "Change your thoughts and you change your world.",
        "author": "Norman Vincent Peale",
        "wordIndices": [0, 2, 1, 7],
        "date": "2025-01-17"
    },
    {
        "text": "The only person you are destined to become is the person you decide to be.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 5, 7, 12],
        "date": "2025-01-18"
    },
    {
        "text": "It is never too late to be what you might have been.",
        "author": "T.S. Eliot",
        "wordIndices": [2, 4, 7, 11],
        "date": "2025-01-19"
    },
    {
        "text": "You cannot shake hands with a clenched fist.",
        "author": "Mahatma Gandhi",
        "wordIndices": [1, 2, 6, 7],
        "date": "2025-01-20"
    },
    {
        "text": "The secret of getting ahead is getting started.",
        "author": "Mark Twain",
        "wordIndices": [1, 3, 4, 7],
        "date": "2025-01-21"
    },
    {
        "text": "What we think, we become.",
        "author": "Buddha",
        "wordIndices": [0, 2, 1, 4],
        "date": "2025-01-22"
    },
    {
        "text": "A goal is a dream with a deadline.",
        "author": "Napoleon Hill",
        "wordIndices": [1, 4, 5, 7],
        "date": "2025-01-23"
    },
    {
        "text": "Act as if what you do makes a difference. It does.",
        "author": "William James",
        "wordIndices": [0, 3, 6, 8],
        "date": "2025-01-24"
    },
    {
        "text": "The best preparation for tomorrow is doing your best today.",
        "author": "Jesse Jackson",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-01-25"
    },
    {
        "text": "You are never too old to set another goal or to dream a new dream.",
        "author": "C.S. Lewis",
        "wordIndices": [2, 6, 8, 11],
        "date": "2025-01-26"
    },
    {
        "text": "The only true wisdom is in knowing you know nothing.",
        "author": "Socrates",
        "wordIndices": [2, 3, 6, 9],
        "date": "2025-01-27"
    },
    {
        "text": "It is not the mountain we conquer, but ourselves.",
        "author": "Edmund Hillary",
        "wordIndices": [4, 6, 7, 8],
        "date": "2025-01-28"
    },
    {
        "text": "Life is short, and it is up to you to make it sweet.",
        "author": "Sarah Bernhardt",
        "wordIndices": [0, 2, 10, 12],
        "date": "2025-01-29"
    },
    {
        "text": "The way to get started is to quit talking and begin doing.",
        "author": "Walt Disney",
        "wordIndices": [4, 7, 8, 10],
        "date": "2025-01-30"
    },
    {
        "text": "January is the month of new beginnings.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-01-31"
    },
    {
        "text": "February is the bridge between winter and spring.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 6, 8],
        "date": "2025-02-01"
    },
    {
        "text": "The shortest month has the longest potential.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 6],
        "date": "2025-02-02"
    },
    {
        "text": "February brings the promise of spring.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 6],
        "date": "2025-02-03"
    },
    {
        "text": "Winter is the time for comfort and good food.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 6, 8],
        "date": "2025-02-04"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "wordIndices": [1, 2, 6, 9, 12],
        "date": "2025-02-05"
    },
    {
        "text": "Every new day is a chance to change your life.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 5, 8],
        "date": "2025-02-06"
    },
    {
        "text": "The journey of a thousand miles begins with a single step.",
        "author": "Lao Tzu",
        "wordIndices": [1, 4, 6, 10],
        "date": "2025-02-07"
    },
    {
        "text": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "author": "Winston Churchill",
        "wordIndices": [0, 4, 11, 13],
        "date": "2025-02-08"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "wordIndices": [1, 5, 6, 9],
        "date": "2025-02-09"
    },
    {
        "text": "Believe you can and you are halfway there.",
        "author": "Theodore Roosevelt",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-02-10"
    },
    {
        "text": "The best way to predict the future is to create it.",
        "author": "Peter Drucker",
        "wordIndices": [1, 4, 6, 9],
        "date": "2025-02-11"
    },
    {
        "text": "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 7, 11, 16],
        "date": "2025-02-12"
    },
    {
        "text": "The only way to make sense out of change is to plunge into it, move with it, and enjoy the dance.",
        "author": "Alan Watts",
        "wordIndices": [4, 8, 11, 18],
        "date": "2025-02-13"
    },
    {
        "text": "Life is either a daring adventure or nothing at all.",
        "author": "Helen Keller",
        "wordIndices": [0, 4, 5, 7],
        "date": "2025-02-14"
    },
    {
        "text": "You miss 100 percent of the shots you do not take.",
        "author": "Wayne Gretzky",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-02-15"
    },
    {
        "text": "The greatest wealth is to live content with little.",
        "author": "Plato",
        "wordIndices": [1, 2, 6, 8],
        "date": "2025-02-16"
    },
    {
        "text": "Success is to be measured not by wealth, but by the legacy you leave behind.",
        "author": "Unknown",
        "wordIndices": [0, 4, 7, 11],
        "date": "2025-02-17"
    },
    {
        "text": "The purpose of our lives is to be happy.",
        "author": "Dalai Lama",
        "wordIndices": [1, 4, 7, 8],
        "date": "2025-02-18"
    },
    {
        "text": "Change your thoughts and you change your world.",
        "author": "Norman Vincent Peale",
        "wordIndices": [0, 2, 1, 7],
        "date": "2025-02-19"
    },
    {
        "text": "The only person you are destined to become is the person you decide to be.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 5, 7, 12],
        "date": "2025-02-20"
    },
    {
        "text": "It is never too late to be what you might have been.",
        "author": "T.S. Eliot",
        "wordIndices": [2, 4, 7, 11],
        "date": "2025-02-21"
    },
    {
        "text": "You cannot shake hands with a clenched fist.",
        "author": "Mahatma Gandhi",
        "wordIndices": [1, 2, 6, 7],
        "date": "2025-02-22"
    },
    {
        "text": "The secret of getting ahead is getting started.",
        "author": "Mark Twain",
        "wordIndices": [1, 3, 4, 7],
        "date": "2025-02-23"
    },
    {
        "text": "What we think, we become.",
        "author": "Buddha",
        "wordIndices": [0, 2, 1, 4],
        "date": "2025-02-24"
    },
    {
        "text": "A goal is a dream with a deadline.",
        "author": "Napoleon Hill",
        "wordIndices": [1, 4, 5, 7],
        "date": "2025-02-25"
    },
    {
        "text": "Act as if what you do makes a difference. It does.",
        "author": "William James",
        "wordIndices": [0, 3, 6, 8],
        "date": "2025-02-26"
    },
    {
        "text": "The best preparation for tomorrow is doing your best today.",
        "author": "Jesse Jackson",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-02-27"
    },
    {
        "text": "You are never too old to set another goal or to dream a new dream.",
        "author": "C.S. Lewis",
        "wordIndices": [2, 6, 8, 11],
        "date": "2025-02-28"
    },
    {
        "text": "March comes in like a lion and goes out like a lamb.",
        "author": "English Proverb",
        "wordIndices": [0, 2, 4, 7, 10],
        "date": "2025-03-01"
    },
    {
        "text": "March is the month of expectation.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4],
        "date": "2025-03-02"
    },
    {
        "text": "Spring brings renewal and hope to the world.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 6],
        "date": "2025-03-03"
    },
    {
        "text": "March winds and April showers bring forth May flowers.",
        "author": "English Proverb",
        "wordIndices": [0, 1, 4, 6, 9],
        "date": "2025-03-04"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "wordIndices": [1, 2, 6, 9, 12],
        "date": "2025-03-05"
    },
    {
        "text": "Every new day is a chance to change your life.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 5, 8],
        "date": "2025-03-06"
    },
    {
        "text": "The journey of a thousand miles begins with a single step.",
        "author": "Lao Tzu",
        "wordIndices": [1, 4, 6, 10],
        "date": "2025-03-07"
    },
    {
        "text": "The journey of a thousand miles begins with a single step.",
        "author": "Lao Tzu",
        "wordIndices": [1, 4, 6, 10],
        "date": "2025-03-08"
    },
    {
        "text": "March winds bring April showers.",
        "author": "English Proverb",
        "wordIndices": [0, 1, 4],
        "date": "2025-03-09"
    },
    {
        "text": "Spring is the time for new beginnings.",
        "author": "Anonymous",
        "wordIndices": [0, 3, 5, 7],
        "date": "2025-03-10"
    },
    {
        "text": "March is the month of expectation.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4],
        "date": "2025-03-11"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "wordIndices": [1, 2, 6, 9, 12],
        "date": "2025-03-12"
    },
    {
        "text": "Every new day is a chance to change your life.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 5, 8],
        "date": "2025-03-13"
    },
    {
        "text": "The journey of a thousand miles begins with a single step.",
        "author": "Lao Tzu",
        "wordIndices": [1, 4, 6, 10],
        "date": "2025-03-14"
    },
    {
        "text": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "author": "Winston Churchill",
        "wordIndices": [0, 4, 11, 13],
        "date": "2025-03-15"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "wordIndices": [1, 5, 6, 9],
        "date": "2025-03-16"
    },
    {
        "text": "Believe you can and you are halfway there.",
        "author": "Theodore Roosevelt",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-03-17"
    },
    {
        "text": "The best way to predict the future is to create it.",
        "author": "Peter Drucker",
        "wordIndices": [1, 4, 6, 9],
        "date": "2025-03-18"
    },
    {
        "text": "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 7, 11, 16],
        "date": "2025-03-19"
    },
    {
        "text": "The only way to make sense out of change is to plunge into it, move with it, and enjoy the dance.",
        "author": "Alan Watts",
        "wordIndices": [4, 8, 11, 18],
        "date": "2025-03-20"
    },
    {
        "text": "Life is either a daring adventure or nothing at all.",
        "author": "Helen Keller",
        "wordIndices": [0, 4, 5, 7],
        "date": "2025-03-21"
    },
    {
        "text": "You miss 100 percent of the shots you do not take.",
        "author": "Wayne Gretzky",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-03-22"
    },
    {
        "text": "The greatest wealth is to live content with little.",
        "author": "Plato",
        "wordIndices": [1, 2, 6, 8],
        "date": "2025-03-23"
    },
    {
        "text": "Success is to be measured not by wealth, but by the legacy you leave behind.",
        "author": "Unknown",
        "wordIndices": [0, 4, 7, 11],
        "date": "2025-03-24"
    },
    {
        "text": "The purpose of our lives is to be happy.",
        "author": "Dalai Lama",
        "wordIndices": [1, 4, 7, 8],
        "date": "2025-03-25"
    },
    {
        "text": "Change your thoughts and you change your world.",
        "author": "Norman Vincent Peale",
        "wordIndices": [0, 2, 1, 7],
        "date": "2025-03-26"
    },
    {
        "text": "The only person you are destined to become is the person you decide to be.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 5, 7, 12],
        "date": "2025-03-27"
    },
    {
        "text": "It is never too late to be what you might have been.",
        "author": "T.S. Eliot",
        "wordIndices": [2, 4, 7, 11],
        "date": "2025-03-28"
    },
    {
        "text": "You cannot shake hands with a clenched fist.",
        "author": "Mahatma Gandhi",
        "wordIndices": [1, 2, 6, 7],
        "date": "2025-03-29"
    },
    {
        "text": "The secret of getting ahead is getting started.",
        "author": "Mark Twain",
        "wordIndices": [1, 3, 4, 7],
        "date": "2025-03-30"
    },
    {
        "text": "March goes out like a lamb.",
        "author": "English Proverb",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-03-31"
    },
    {
        "text": "April showers bring May flowers.",
        "author": "English Proverb",
        "wordIndices": [0, 1, 4],
        "date": "2025-04-01"
    },
    {
        "text": "The best time to plant a tree was twenty years ago. The second best time is now.",
        "author": "Chinese Proverb",
        "wordIndices": [4, 9, 14],
        "date": "2025-04-02"
    },
    {
        "text": "Spring brings new life to the world around us.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 6],
        "date": "2025-04-03"
    },
    {
        "text": "In every walk with nature, one receives far more than they seek.",
        "author": "John Muir",
        "wordIndices": [2, 4, 6, 12],
        "date": "2025-04-04"
    },
    {
        "text": "The earth laughs in flowers.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [1, 2, 4],
        "date": "2025-04-05"
    },
    {
        "text": "Bloom where you are planted.",
        "author": "Saint Francis de Sales",
        "wordIndices": [0, 4],
        "date": "2025-04-06"
    },
    {
        "text": "Every flower is a soul blossoming in nature.",
        "author": "Gerard de Nerval",
        "wordIndices": [0, 2, 5, 7],
        "date": "2025-04-07"
    },
    {
        "text": "The earth has music for those who listen.",
        "author": "George Santayana",
        "wordIndices": [1, 3, 6, 8],
        "date": "2025-04-08"
    },
    {
        "text": "Nature always wears the colors of the spirit.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [0, 2, 5, 8],
        "date": "2025-04-09"
    },
    {
        "text": "April is the kindest month.",
        "author": "T.S. Eliot",
        "wordIndices": [0, 2, 4],
        "date": "2025-04-10"
    },
    {
        "text": "Spring is the time of plans and projects.",
        "author": "Leo Tolstoy",
        "wordIndices": [0, 3, 5, 7],
        "date": "2025-04-11"
    },
    {
        "text": "The world is mud-luscious and puddle-wonderful.",
        "author": "E.E. Cummings",
        "wordIndices": [1, 3, 5],
        "date": "2025-04-12"
    },
    {
        "text": "April prepares her green traffic light and the world thinks Go.",
        "author": "Christopher Morley",
        "wordIndices": [0, 3, 6, 9, 12],
        "date": "2025-04-13"
    },
    {
        "text": "Spring will come and so will happiness.",
        "author": "Anonymous",
        "wordIndices": [0, 3, 5, 7],
        "date": "2025-04-14"
    },
    {
        "text": "The first day of spring is one thing, and the first spring day is another.",
        "author": "Henry Van Dyke",
        "wordIndices": [1, 4, 7, 10, 13],
        "date": "2025-04-15"
    },
    {
        "text": "April hath put a spirit of youth in everything.",
        "author": "William Shakespeare",
        "wordIndices": [0, 3, 6, 9],
        "date": "2025-04-16"
    },
    {
        "text": "Spring is when life awakens in everything.",
        "author": "Christina Rossetti",
        "wordIndices": [0, 3, 6, 8],
        "date": "2025-04-17"
    },
    {
        "text": "The beautiful spring came; and when Nature resumes her loveliness, the human soul is apt to revive also.",
        "author": "Harriet Ann Jacobs",
        "wordIndices": [1, 3, 6, 9, 12, 15],
        "date": "2025-04-18"
    },
    {
        "text": "Spring is the time for new beginnings.",
        "author": "Anonymous",
        "wordIndices": [0, 3, 5, 7],
        "date": "2025-04-19"
    },
    {
        "text": "April brings gentle rains and fresh green leaves.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 6, 8],
        "date": "2025-04-20"
    },
    {
        "text": "The earth awakens with beauty and grace.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 5, 7],
        "date": "2025-04-21"
    },
    {
        "text": "Spring brings renewal and hope to the world.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 6],
        "date": "2025-04-22"
    },
    {
        "text": "In every walk with nature, one receives far more than they seek.",
        "author": "John Muir",
        "wordIndices": [2, 4, 6, 12],
        "date": "2025-04-23"
    },
    {
        "text": "April winds bring May flowers.",
        "author": "English Proverb",
        "wordIndices": [0, 1, 4],
        "date": "2025-04-24"
    },
    {
        "text": "Spring rain brings summer flowers.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4],
        "date": "2025-04-25"
    },
    {
        "text": "Nature never hurries, yet everything is accomplished.",
        "author": "Lao Tzu",
        "wordIndices": [0, 2, 5, 7],
        "date": "2025-04-26"
    },
    {
        "text": "The garden of the world has no limits, except in your mind.",
        "author": "Rumi",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-04-27"
    },
    {
        "text": "Every flower is a soul blossoming in nature.",
        "author": "Gerard de Nerval",
        "wordIndices": [0, 2, 5, 7],
        "date": "2025-04-28"
    },
    {
        "text": "Spring is the time of year when it is summer in the sun and winter in the shade.",
        "author": "Charles Dickens",
        "wordIndices": [0, 3, 6, 9, 12, 15],
        "date": "2025-04-29"
    },
    {
        "text": "April is the month of expectation.",
        "author": "Emily Dickinson",
        "wordIndices": [0, 2, 4],
        "date": "2025-04-30"
    },
    {
        "text": "May what I do flow from me like a river, no forcing and no holding back.",
        "author": "Rainer Maria Rilke",
        "wordIndices": [4, 9, 11, 14],
        "date": "2025-05-01"
    },
    {
        "text": "The flower that blooms in adversity is the rarest and most beautiful of all.",
        "author": "Walt Disney",
        "wordIndices": [1, 3, 5, 8, 11],
        "date": "2025-05-02"
    },
    {
        "text": "Where flowers bloom, so does hope.",
        "author": "Lady Bird Johnson",
        "wordIndices": [1, 2, 5],
        "date": "2025-05-03"
    },
    {
        "text": "Keep your face always toward the sunshine and shadows will fall behind you.",
        "author": "Walt Whitman",
        "wordIndices": [2, 6, 8, 12],
        "date": "2025-05-04"
    },
    {
        "text": "Life is like a garden. Perfect moments can be had, but not preserved, except in memory.",
        "author": "Leonard Nimoy",
        "wordIndices": [4, 6, 7, 12, 16],
        "date": "2025-05-05"
    },
    {
        "text": "The best way to predict the future is to create it.",
        "author": "Peter Drucker",
        "wordIndices": [1, 4, 6, 9],
        "date": "2025-05-06"
    },
    {
        "text": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "author": "Winston Churchill",
        "wordIndices": [0, 4, 11, 13],
        "date": "2025-05-07"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "wordIndices": [1, 5, 6, 9],
        "date": "2025-05-08"
    },
    {
        "text": "Believe you can and you're halfway there.",
        "author": "Theodore Roosevelt",
        "wordIndices": [0, 2, 4, 5],
        "date": "2025-05-09"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "wordIndices": [1, 2, 6, 9, 12],
        "date": "2025-05-10"
    },
    {
        "text": "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 7, 11, 16],
        "date": "2025-05-11"
    },
    {
        "text": "The only way to make sense out of change is to plunge into it, move with it, and enjoy the dance.",
        "author": "Alan Watts",
        "wordIndices": [4, 8, 11, 18],
        "date": "2025-05-12"
    },
    {
        "text": "Life is either a daring adventure or nothing at all.",
        "author": "Helen Keller",
        "wordIndices": [0, 4, 5, 7],
        "date": "2025-05-13"
    },
    {
        "text": "You miss 100 percent of the shots you don't take.",
        "author": "Wayne Gretzky",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-05-14"
    },
    {
        "text": "The greatest wealth is to live content with little.",
        "author": "Plato",
        "wordIndices": [1, 2, 6, 8],
        "date": "2025-05-15"
    },
    {
        "text": "Success is to be measured not by wealth, but by the legacy you leave behind.",
        "author": "Unknown",
        "wordIndices": [0, 4, 7, 11],
        "date": "2025-05-16"
    },
    {
        "text": "The purpose of our lives is to be happy.",
        "author": "Dalai Lama",
        "wordIndices": [1, 4, 7, 8],
        "date": "2025-05-17"
    },
    {
        "text": "Change your thoughts and you change your world.",
        "author": "Norman Vincent Peale",
        "wordIndices": [0, 2, 1, 7],
        "date": "2025-05-18"
    },
    {
        "text": "The only person you are destined to become is the person you decide to be.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 5, 7, 12],
        "date": "2025-05-19"
    },
    {
        "text": "It is never too late to be what you might have been.",
        "author": "T.S. Eliot",
        "wordIndices": [2, 4, 7, 11],
        "date": "2025-05-20"
    },
    {
        "text": "You cannot shake hands with a clenched fist.",
        "author": "Mahatma Gandhi",
        "wordIndices": [1, 2, 6, 7],
        "date": "2025-05-21"
    },
    {
        "text": "The secret of getting ahead is getting started.",
        "author": "Mark Twain",
        "wordIndices": [1, 3, 4, 7],
        "date": "2025-05-22"
    },
    {
        "text": "What we think, we become.",
        "author": "Buddha",
        "wordIndices": [0, 2, 1, 4],
        "date": "2025-05-23"
    },
    {
        "text": "A goal is a dream with a deadline.",
        "author": "Napoleon Hill",
        "wordIndices": [1, 4, 5, 7],
        "date": "2025-05-24"
    },
    {
        "text": "Act as if what you do makes a difference. It does.",
        "author": "William James",
        "wordIndices": [0, 3, 6, 8],
        "date": "2025-05-25"
    },
    {
        "text": "The best preparation for tomorrow is doing your best today.",
        "author": "Jesse Jackson",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-05-26"
    },
    {
        "text": "You are never too old to set another goal or to dream a new dream.",
        "author": "C.S. Lewis",
        "wordIndices": [2, 6, 8, 11],
        "date": "2025-05-27"
    },
    {
        "text": "The only true wisdom is in knowing you know nothing.",
        "author": "Socrates",
        "wordIndices": [2, 3, 6, 9],
        "date": "2025-05-28"
    },
    {
        "text": "It is not the mountain we conquer, but ourselves.",
        "author": "Edmund Hillary",
        "wordIndices": [4, 6, 7, 8],
        "date": "2025-05-29"
    },
    {
        "text": "Life is short, and it is up to you to make it sweet.",
        "author": "Sarah Bernhardt",
        "wordIndices": [0, 2, 10, 12],
        "date": "2025-05-30"
    },
    {
        "text": "The way to get started is to quit talking and begin doing.",
        "author": "Walt Disney",
        "wordIndices": [4, 7, 8, 10],
        "date": "2025-05-31"
    },
    {
        "text": "Summer afternoon—summer afternoon; to me those have always been the two most beautiful words in the English language.",
        "author": "Henry James",
        "wordIndices": [0, 1, 11, 16],
        "date": "2025-06-01"
    },
    {
        "text": "You must be the change you wish to see in the world.",
        "author": "Mahatma Gandhi",
        "wordIndices": [4, 6, 8, 11],
        "date": "2025-06-02"
    },
    {
        "text": "Happiness is not something ready made. It comes from your own actions.",
        "author": "Dalai Lama",
        "wordIndices": [0, 3, 7, 11],
        "date": "2025-06-03"
    },
    {
        "text": "Do what you can, with what you have, where you are.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 2, 8, 10],
        "date": "2025-06-04"
    },
    {
        "text": "Every moment is a fresh beginning.",
        "author": "T.S. Eliot",
        "wordIndices": [0, 1, 4, 5],
        "date": "2025-06-05"
    },
    {
        "text": "The only limit to our realization of tomorrow will be our doubts of today.",
        "author": "Theodore Roosevelt",
        "wordIndices": [2, 5, 11, 13],
        "date": "2025-06-06"
    },
    {
        "text": "To handle yourself, use your head; to handle others, use your heart.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 2, 3, 11],
        "date": "2025-06-07"
    },
    {
        "text": "The mind is everything. What you think you become.",
        "author": "Buddha",
        "wordIndices": [1, 3, 6, 8],
        "date": "2025-06-08"
    },
    {
        "text": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        "author": "Aristotle",
        "wordIndices": [4, 6, 11, 14],
        "date": "2025-06-09"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "wordIndices": [1, 2, 6, 9, 12],
        "date": "2025-06-10"
    },
    {
        "text": "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 7, 11, 16],
        "date": "2025-06-11"
    },
    {
        "text": "The only way to make sense out of change is to plunge into it, move with it, and enjoy the dance.",
        "author": "Alan Watts",
        "wordIndices": [4, 8, 11, 18],
        "date": "2025-06-12"
    },
    {
        "text": "Life is either a daring adventure or nothing at all.",
        "author": "Helen Keller",
        "wordIndices": [0, 4, 5, 7],
        "date": "2025-06-13"
    },
    {
        "text": "You miss 100 percent of the shots you don't take.",
        "author": "Wayne Gretzky",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-06-14"
    },
    {
        "text": "The greatest wealth is to live content with little.",
        "author": "Plato",
        "wordIndices": [1, 2, 6, 8],
        "date": "2025-06-15"
    },
    {
        "text": "Success is to be measured not by wealth, but by the legacy you leave behind.",
        "author": "Unknown",
        "wordIndices": [0, 4, 7, 11],
        "date": "2025-06-16"
    },
    {
        "text": "The purpose of our lives is to be happy.",
        "author": "Dalai Lama",
        "wordIndices": [1, 4, 7, 8],
        "date": "2025-06-17"
    },
    {
        "text": "Change your thoughts and you change your world.",
        "author": "Norman Vincent Peale",
        "wordIndices": [0, 2, 1, 7],
        "date": "2025-06-18"
    },
    {
        "text": "The only person you are destined to become is the person you decide to be.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [2, 5, 7, 12],
        "date": "2025-06-19"
    },
    {
        "text": "It is never too late to be what you might have been.",
        "author": "T.S. Eliot",
        "wordIndices": [2, 4, 7, 11],
        "date": "2025-06-20"
    },
    {
        "text": "You cannot shake hands with a clenched fist.",
        "author": "Mahatma Gandhi",
        "wordIndices": [1, 2, 6, 7],
        "date": "2025-06-21"
    },
    {
        "text": "The secret of getting ahead is getting started.",
        "author": "Mark Twain",
        "wordIndices": [1, 3, 4, 7],
        "date": "2025-06-22"
    },
    {
        "text": "What we think, we become.",
        "author": "Buddha",
        "wordIndices": [0, 2, 1, 4],
        "date": "2025-06-23"
    },
    {
        "text": "A goal is a dream with a deadline.",
        "author": "Napoleon Hill",
        "wordIndices": [1, 4, 5, 7],
        "date": "2025-06-24"
    },
    {
        "text": "Act as if what you do makes a difference. It does.",
        "author": "William James",
        "wordIndices": [0, 3, 6, 8],
        "date": "2025-06-25"
    },
    {
        "text": "The best preparation for tomorrow is doing your best today.",
        "author": "Jesse Jackson",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-06-26"
    },
    {
        "text": "You are never too old to set another goal or to dream a new dream.",
        "author": "C.S. Lewis",
        "wordIndices": [2, 6, 8, 11],
        "date": "2025-06-27"
    },
    {
        "text": "The only true wisdom is in knowing you know nothing.",
        "author": "Socrates",
        "wordIndices": [2, 3, 6, 9],
        "date": "2025-06-28"
    },
    {
        "text": "It is not the mountain we conquer, but ourselves.",
        "author": "Edmund Hillary",
        "wordIndices": [4, 6, 7, 8],
        "date": "2025-06-29"
    },
    {
        "text": "Life is short, and it is up to you to make it sweet.",
        "author": "Sarah Bernhardt",
        "wordIndices": [0, 2, 10, 12],
        "date": "2025-06-30"
    },
    {
        "text": "The way to get started is to quit talking and begin doing.",
        "author": "Walt Disney",
        "wordIndices": [4, 7, 8, 10],
        "date": "2025-07-01"
    },
    {
        "text": "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
        "author": "James Cameron",
        "wordIndices": [4, 5, 10, 16],
        "date": "2025-07-02"
    },
    {
        "text": "If you look at what you have in life, you'll always have more.",
        "author": "Oprah Winfrey",
        "wordIndices": [2, 4, 8, 10],
        "date": "2025-07-03"
    },
    {
        "text": "If life were predictable it would cease to be life, and be without flavor.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 3, 6, 13],
        "date": "2025-07-04"
    },
    {
        "text": "The greatest glory in living is not in never falling, but in rising every time we fall.",
        "author": "Nelson Mandela",
        "wordIndices": [1, 2, 9, 12],
        "date": "2025-07-05"
    },
    {
        "text": "It does not matter how slowly you go as long as you do not stop.",
        "author": "Confucius",
        "wordIndices": [3, 5, 9, 14],
        "date": "2025-07-06"
    },
    {
        "text": "Whether you think you can or you think you can't, you're right.",
        "author": "Henry Ford",
        "wordIndices": [0, 2, 1, 10],
        "date": "2025-07-07"
    },
    {
        "text": "The best revenge is massive success.",
        "author": "Frank Sinatra",
        "wordIndices": [1, 2, 4, 5],
        "date": "2025-07-08"
    },
    {
        "text": "Life is what we make it, always has been, always will be.",
        "author": "Grandma Moses",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-07-09"
    },
    {
        "text": "The only impossible journey is the one you never start.",
        "author": "Tony Robbins",
        "wordIndices": [1, 2, 3, 8],
        "date": "2025-07-10"
    },
    {
        "text": "Believe you can and you're halfway there.",
        "author": "Theodore Roosevelt",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-07-11"
    },
    {
        "text": "It is during our darkest moments that we must focus to see the light.",
        "author": "Aristotle",
        "wordIndices": [2, 4, 5, 9],
        "date": "2025-07-12"
    },
    {
        "text": "Don't let yesterday take up too much of today.",
        "author": "Will Rogers",
        "wordIndices": [2, 3, 6, 8],
        "date": "2025-07-13"
    },
    {
        "text": "The way to get started is to quit talking and begin doing.",
        "author": "Walt Disney",
        "wordIndices": [4, 7, 8, 11],
        "date": "2025-07-14"
    },
    {
        "text": "Your time is limited, don't waste it living someone else's life.",
        "author": "Steve Jobs",
        "wordIndices": [1, 3, 5, 7],
        "date": "2025-07-15"
    },
    {
        "text": "The best time to plant a tree was 20 years ago. The second best time is now.",
        "author": "Chinese Proverb",
        "wordIndices": [1, 4, 9, 12],
        "date": "2025-07-16"
    },
    {
        "text": "Innovation distinguishes between a leader and a follower.",
        "author": "Steve Jobs",
        "wordIndices": [0, 1, 4, 7],
        "date": "2025-07-17"
    },
    {
        "text": "The only thing we have to fear is fear itself.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 2, 6, 9],
        "date": "2025-07-18"
    },
    {
        "text": "In the middle of difficulty lies opportunity.",
        "author": "Albert Einstein",
        "wordIndices": [2, 4, 5, 6],
        "date": "2025-07-19"
    },
    {
        "text": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "author": "Winston Churchill",
        "wordIndices": [0, 4, 11, 13],
        "date": "2025-07-20"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 2, 6, 9],
        "date": "2025-07-21"
    },
    {
        "text": "Be yourself; everyone else is already taken.",
        "author": "Oscar Wilde",
        "wordIndices": [1, 2, 5, 6],
        "date": "2025-07-22"
    },
    {
        "text": "Life is what happens when you're busy making other plans.",
        "author": "John Lennon",
        "wordIndices": [2, 3, 6, 7],
        "date": "2025-07-23"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "wordIndices": [1, 5, 6, 9],
        "date": "2025-07-24"
    },
    {
        "text": "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
        "author": "Benjamin Franklin",
        "wordIndices": [0, 4, 9, 14],
        "date": "2025-07-25"
    },
    {
        "text": "You have been assigned this mountain to show others it can be moved.",
        "author": "Unknown",
        "wordIndices": [3, 5, 7, 12],
        "date": "2025-07-26"
    },
    {
        "text": "Do not go where the path may lead, go where there is no path and leave a trail.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [3, 5, 1, 17],
        "date": "2025-07-27"
    },
    {
        "text": "It is better to be hated for what you are than to be loved for what you are not.",
        "author": "André Gide",
        "wordIndices": [2, 5, 13, 7],
        "date": "2025-07-28"
    },
    {
        "text": "Always remember that you are absolutely unique. Just like everyone else.",
        "author": "Mark Twain",
        "wordIndices": [1, 5, 6, 9],
        "date": "2025-07-29"
    },
    {
        "text": "When you reach the end of your rope, tie a knot in it and hang on.",
        "author": "Theodore Roosevelt",
        "wordIndices": [2, 7, 10, 14],
        "date": "2025-07-30"
    },
    {
        "text": "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
        "author": "Mother Teresa",
        "wordIndices": [0, 2, 13, 14],
        "date": "2025-07-31"
    },
    {
        "text": "The only real mistake is the one from which we learn nothing.",
        "author": "Henry Ford",
        "wordIndices": [1, 3, 10, 11],
        "date": "2025-08-02"
    },
    {
        "text": "The future starts today, not tomorrow.",
        "author": "Pope John Paul II",
        "wordIndices": [1, 2, 3, 5],
        "date": "2025-08-01"
    },
    {
        "text": "Do one thing every day that scares you.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 2, 4, 6],
        "date": "2025-08-03"
    },
    {
        "text": "The greatest discovery of all time is that a person can change his future by merely changing his attitude.",
        "author": "Oprah Winfrey",
        "wordIndices": [1, 2, 11, 18],
        "date": "2025-08-04"
    },
    {
        "text": "Do one thing every day that scares you.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 2, 4, 6],
        "date": "2025-08-05"
    },
    {
        "text": "What you do today can improve all your tomorrows.",
        "author": "Ralph Nader",
        "wordIndices": [0, 3, 5, 8],
        "date": "2025-08-06"
    },
    {
        "text": "Success is not the absence of obstacles, but the courage to push through them.",
        "author": "Unknown",
        "wordIndices": [0, 4, 9, 12],
        "date": "2025-08-07"
    },
    {
        "text": "The only thing standing between you and your goal is the story you keep telling yourself.",
        "author": "Tony Robbins",
        "wordIndices": [1, 3, 8, 14],
        "date": "2025-08-08"
    },
    {
        "text": "You can't go back and change the beginning, but you can start where you are and change the ending.",
        "author": "C.S. Lewis",
        "wordIndices": [5, 7, 11, 18],
        "date": "2025-08-09"
    },
    {
        "text": "The best way to predict the future is to create it.",
        "author": "Peter Drucker",
        "wordIndices": [1, 4, 6, 9],
        "date": "2025-08-10"
    },
    {
        "text": "It is not what you look at that matters, it is what you see.",
        "author": "Henry David Thoreau",
        "wordIndices": [3, 5, 8, 13],
        "date": "2025-08-11"
    },
    {
        "text": "The only way to achieve the impossible is to believe it is possible.",
        "author": "Lewis Carroll",
        "wordIndices": [1, 4, 6, 9],
        "date": "2025-08-12"
    },
    {
        "text": "You are braver than you believe, stronger than you seem, and smarter than you think.",
        "author": "A.A. Milne",
        "wordIndices": [2, 5, 6, 11],
        "date": "2025-08-13"
    },
    {
        "text": "The greatest risk is not taking any risk at all.",
        "author": "Mark Zuckerberg",
        "wordIndices": [1, 2, 5, 3],
        "date": "2025-08-14"
    },
    {
        "text": "Don't watch the clock; do what it does. Keep going.",
        "author": "Sam Levenson",
        "wordIndices": [1, 3, 7, 8],
        "date": "2025-08-15"
    },
    {
        "text": "The only limit to our realization of tomorrow is our doubts of today.",
        "author": "Theodore Roosevelt",
        "wordIndices": [2, 5, 7, 10],
        "date": "2025-08-16"
    },
    {
        "text": "Your life does not get better by chance, it gets better by change.",
        "author": "Jim Rohn",
        "wordIndices": [1, 5, 7, 12],
        "date": "2025-08-17"
    },
    {
        "text": "The only person you should try to be better than is the person you were yesterday.",
        "author": "Unknown",
        "wordIndices": [2, 5, 8, 15],
        "date": "2025-08-18"
    },
    {
        "text": "Success is walking from failure to failure with no loss of enthusiasm.",
        "author": "Winston Churchill",
        "wordIndices": [0, 4, 1, 11],
        "date": "2025-08-19"
    },
    {
        "text": "The best way out is always through.",
        "author": "Robert Frost",
        "wordIndices": [1, 2, 5, 6],
        "date": "2025-08-20"
    },
    {
        "text": "What you get by achieving your goals is not as important as what you become by achieving your goals.",
        "author": "Zig Ziglar",
        "wordIndices": [4, 6, 10, 14],
        "date": "2025-08-21"
    },
    {
        "text": "The only thing that stands between you and your dream is the will to try and the belief that it is actually possible.",
        "author": "Irving Babbitt",
        "wordIndices": [2, 9, 12, 17],
        "date": "2025-08-22"
    },
    {
        "text": "You must do the thing you think you cannot do.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 4, 6, 8],
        "date": "2025-08-23"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "wordIndices": [1, 5, 9, 10],
        "date": "2025-08-24"
    },
    {
        "text": "If you want to lift yourself up, lift up someone else.",
        "author": "Booker T. Washington",
        "wordIndices": [2, 4, 5, 9],
        "date": "2025-08-25"
    },
    {
        "text": "The greatest glory is not in never failing, but in rising up every time we fail.",
        "author": "Ralph Waldo Emerson",
        "wordIndices": [1, 2, 7, 10],
        "date": "2025-08-26"
    },
    {
        "text": "The only limit is the one you set yourself.",
        "author": "Unknown",
        "wordIndices": [1, 2, 7, 8],
        "date": "2025-08-27"
    },
    {
        "text": "You have within you, right now, everything you need to deal with whatever the world can throw at you.",
        "author": "Brian Tracy",
        "wordIndices": [2, 4, 6, 10],
        "date": "2025-08-28"
    },
    {
        "text": "The only way to discover the limits of the possible is to go beyond them into the impossible.",
        "author": "Arthur C. Clarke",
        "wordIndices": [4, 6, 9, 17],
        "date": "2025-08-29"
    },
    {
        "text": "What we achieve inwardly will change outer reality.",
        "author": "Plutarch",
        "wordIndices": [0, 2, 3, 7],
        "date": "2025-08-30"
    },
    {
        "text": "The only thing we have to fear is fear itself.",
        "author": "Theodore Roosevelt",
        "wordIndices": [1, 2, 6, 9],
        "date": "2025-08-31"
    },
    {
        "text": "September is the month of new beginnings and fresh starts.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 7, 9],
        "date": "2025-09-01"
    },
    {
        "text": "Autumn is a second spring when every leaf is a flower.",
        "author": "Albert Camus",
        "wordIndices": [0, 3, 5, 10],
        "date": "2025-09-02"
    },
    {
        "text": "Life starts all over again when it gets crisp in the fall.",
        "author": "F. Scott Fitzgerald",
        "wordIndices": [0, 2, 7, 11],
        "date": "2025-09-03"
    },
    {
        "text": "September brings the promise of change and renewal.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 7],
        "date": "2025-09-04"
    },
    {
        "text": "The leaves are falling, but new opportunities are rising.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 8],
        "date": "2025-09-05"
    },
    {
        "text": "Education is the most powerful weapon which you can use to change the world.",
        "author": "Nelson Mandela",
        "wordIndices": [0, 3, 5, 12],
        "date": "2025-09-06"
    },
    {
        "text": "The beautiful thing about learning is that no one can take it away from you.",
        "author": "B.B. King",
        "wordIndices": [1, 3, 6, 14],
        "date": "2025-09-07"
    },
    {
        "text": "September whispers of autumn's approach with golden leaves.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 7],
        "date": "2025-09-08"
    },
    {
        "text": "Every child is an artist. The problem is how to remain an artist once we grow up.",
        "author": "Pablo Picasso",
        "wordIndices": [1, 4, 6, 12, 16],
        "date": "2025-09-09"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "wordIndices": [1, 5, 6, 9],
        "date": "2025-09-10"
    },
    {
        "text": "September days are here, with summer's best of weather and autumn's best of cheer.",
        "author": "Helen Hunt Jackson",
        "wordIndices": [0, 1, 4, 8, 13],
        "date": "2025-09-11"
    },
    {
        "text": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "wordIndices": [1, 2, 6, 9, 12],
        "date": "2025-09-12"
    },
    {
        "text": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "author": "Winston Churchill",
        "wordIndices": [0, 4, 11, 13],
        "date": "2025-09-13"
    },
    {
        "text": "The only impossible journey is the one you never start.",
        "author": "Tony Robbins",
        "wordIndices": [2, 3, 7, 10],
        "date": "2025-09-14"
    },
    {
        "text": "September is the month when summer's warmth meets autumn's wisdom.",
        "author": "Anonymous",
        "wordIndices": [0, 3, 6, 9],
        "date": "2025-09-15"
    },
    {
        "text": "Life is what happens to you while you're busy making other plans.",
        "author": "John Lennon",
        "wordIndices": [0, 3, 6, 11],
        "date": "2025-09-16"
    },
    {
        "text": "The way to get started is to quit talking and begin doing.",
        "author": "Walt Disney",
        "wordIndices": [4, 7, 8, 10],
        "date": "2025-09-17"
    },
    {
        "text": "September brings the harvest of all our summer dreams.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 8],
        "date": "2025-09-18"
    },
    {
        "text": "The best time to plant a tree was 20 years ago. The second best time is now.",
        "author": "Chinese Proverb",
        "wordIndices": [4, 9, 14],
        "date": "2025-09-19"
    },
    {
        "text": "September is the bridge between summer's end and autumn's beginning.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 7, 10],
        "date": "2025-09-20"
    },
    {
        "text": "Your limitation—it's only your imagination.",
        "author": "Anonymous",
        "wordIndices": [1, 4, 5],
        "date": "2025-09-21"
    },
    {
        "text": "Push yourself, because no one else is going to do it for you.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 6, 12],
        "date": "2025-09-22"
    },
    {
        "text": "Great things never come from comfort zones.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 6],
        "date": "2025-09-23"
    },
    {
        "text": "Dream it. Wish it. Do it.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4],
        "date": "2025-09-24"
    },
    {
        "text": "Success doesn't just find you. You have to go out and get it.",
        "author": "Anonymous",
        "wordIndices": [0, 3, 6, 12],
        "date": "2025-09-25"
    },
    {
        "text": "The harder you work for something, the greater you'll feel when you achieve it.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 13],
        "date": "2025-09-26"
    },
    {
        "text": "Dream bigger. Do bigger.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 3],
        "date": "2025-09-27"
    },
    {
        "text": "Don't stop when you're tired. Stop when you're done.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 6, 9],
        "date": "2025-09-28"
    },
    {
        "text": "Wake up with determination. Go to bed with satisfaction.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 8],
        "date": "2025-09-29"
    },
    {
        "text": "September ends with the promise that October will bring new adventures.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9, 11],
        "date": "2025-09-30"
    },
    {
        "text": "October is the month of painted leaves and harvest moons.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 7, 9],
        "date": "2025-10-01"
    },
    {
        "text": "Autumn carries more gold in its pocket than all the other seasons.",
        "author": "Jim Bishop",
        "wordIndices": [0, 1, 4, 11],
        "date": "2025-10-02"
    },
    {
        "text": "October is nature's art gallery, painted in shades of gold and crimson.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 9, 12],
        "date": "2025-10-03"
    },
    {
        "text": "The trees are about to show us how lovely it is to let things go.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 9, 14],
        "date": "2025-10-04"
    },
    {
        "text": "October brings the beauty of change and the wisdom of letting go.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 10],
        "date": "2025-10-05"
    },
    {
        "text": "Life is like autumn; sometimes you have to let go to grow.",
        "author": "Anonymous",
        "wordIndices": [0, 3, 7, 11],
        "date": "2025-10-06"
    },
    {
        "text": "October whispers secrets of transformation in every falling leaf.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 8],
        "date": "2025-10-07"
    },
    {
        "text": "The best way to predict the future is to create it.",
        "author": "Peter Drucker",
        "wordIndices": [1, 4, 6, 9],
        "date": "2025-10-08"
    },
    {
        "text": "October is the month when nature shows us how beautiful it is to change.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 12],
        "date": "2025-10-09"
    },
    {
        "text": "Every leaf speaks bliss to me, fluttering from the autumn tree.",
        "author": "Emily Bronte",
        "wordIndices": [0, 1, 3, 9],
        "date": "2025-10-10"
    },
    {
        "text": "October brings the harvest of all our year's hard work.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 9],
        "date": "2025-10-11"
    },
    {
        "text": "Autumn is the season of change, reflection, and gratitude.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 7],
        "date": "2025-10-12"
    },
    {
        "text": "October days are golden, filled with crisp air and warm hearts.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 3, 9],
        "date": "2025-10-13"
    },
    {
        "text": "The leaves fall, but the tree remains strong.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 5, 7],
        "date": "2025-10-14"
    },
    {
        "text": "October teaches us that change can be beautiful.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 7],
        "date": "2025-10-15"
    },
    {
        "text": "In October, nature puts on her most beautiful dress.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 8],
        "date": "2025-10-16"
    },
    {
        "text": "October is the month of cozy sweaters and warm memories.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 7, 9],
        "date": "2025-10-17"
    },
    {
        "text": "The beauty of October lies in its ability to let go gracefully.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 11],
        "date": "2025-10-18"
    },
    {
        "text": "October brings the magic of transformation to every tree and heart.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 9, 11],
        "date": "2025-10-19"
    },
    {
        "text": "Autumn shows us how beautiful it is to let things go.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 6, 11],
        "date": "2025-10-20"
    },
    {
        "text": "October is nature's way of showing us that change is beautiful.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 10],
        "date": "2025-10-21"
    },
    {
        "text": "The trees teach us that letting go is part of growing.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 6, 10],
        "date": "2025-10-22"
    },
    {
        "text": "October brings the wisdom of seasons and the beauty of change.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 9],
        "date": "2025-10-23"
    },
    {
        "text": "In October, every leaf is a flower in its own right.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 5, 10],
        "date": "2025-10-24"
    },
    {
        "text": "October is the month when nature paints the world in gold.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 10],
        "date": "2025-10-25"
    },
    {
        "text": "The beauty of autumn is in its graceful surrender to change.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-10-26"
    },
    {
        "text": "October whispers that it's time to harvest the fruits of our labor.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 6, 11],
        "date": "2025-10-27"
    },
    {
        "text": "In October, nature shows us that endings can be beautiful beginnings.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-10-28"
    },
    {
        "text": "October brings the gift of reflection and the promise of renewal.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 9],
        "date": "2025-10-29"
    },
    {
        "text": "The magic of October lies in its ability to transform the ordinary into extraordinary.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 12],
        "date": "2025-10-30"
    },
    {
        "text": "October ends with the promise that November will bring new blessings.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9, 11],
        "date": "2025-10-31"
    },
    {
        "text": "November is the month of gratitude and thanksgiving.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 6],
        "date": "2025-11-01"
    },
    {
        "text": "Gratitude turns what we have into enough.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 7],
        "date": "2025-11-02"
    },
    {
        "text": "November teaches us to be thankful for all our blessings.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9],
        "date": "2025-11-03"
    },
    {
        "text": "In November, we gather the harvest of our year's gratitude.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-11-04"
    },
    {
        "text": "November brings the warmth of family and the joy of togetherness.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 9],
        "date": "2025-11-05"
    },
    {
        "text": "Thanksgiving is not just a day, but a way of living.",
        "author": "Anonymous",
        "wordIndices": [0, 3, 6, 10],
        "date": "2025-11-06"
    },
    {
        "text": "November reminds us that gratitude is the heart of happiness.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9],
        "date": "2025-11-07"
    },
    {
        "text": "In November, we count our blessings instead of our troubles.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-11-08"
    },
    {
        "text": "November is the month when we pause to appreciate life's gifts.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 9],
        "date": "2025-11-09"
    },
    {
        "text": "Gratitude is the fairest blossom which springs from the soul.",
        "author": "Henry Ward Beecher",
        "wordIndices": [0, 3, 4, 9],
        "date": "2025-11-10"
    },
    {
        "text": "November brings the beauty of bare branches and grateful hearts.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 8],
        "date": "2025-11-11"
    },
    {
        "text": "In November, we celebrate the abundance of our lives.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 8],
        "date": "2025-11-12"
    },
    {
        "text": "November teaches us that gratitude is the key to contentment.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9],
        "date": "2025-11-13"
    },
    {
        "text": "The thankful heart opens the door to a world of possibilities.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 5, 10],
        "date": "2025-11-14"
    },
    {
        "text": "November is the month of reflection, gratitude, and family bonds.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 8],
        "date": "2025-11-15"
    },
    {
        "text": "In November, we gather around tables and hearts full of thanks.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 10],
        "date": "2025-11-16"
    },
    {
        "text": "November reminds us that every day is a gift to be treasured.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 6, 10],
        "date": "2025-11-17"
    },
    {
        "text": "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.",
        "author": "Melody Beattie",
        "wordIndices": [0, 1, 6, 15],
        "date": "2025-11-18"
    },
    {
        "text": "November is the month when we count blessings, not calories.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 9],
        "date": "2025-11-19"
    },
    {
        "text": "In November, we feast on gratitude and share the bounty of love.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 10],
        "date": "2025-11-20"
    },
    {
        "text": "November brings families together and hearts closer to gratitude.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 8],
        "date": "2025-11-21"
    },
    {
        "text": "The spirit of November is found in grateful hearts and generous souls.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 10],
        "date": "2025-11-22"
    },
    {
        "text": "November teaches us that gratitude is the memory of the heart.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 10],
        "date": "2025-11-23"
    },
    {
        "text": "In November, we give thanks for the journey and the destination.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-11-24"
    },
    {
        "text": "November is the month of thankful hearts and joyful gatherings.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 8],
        "date": "2025-11-25"
    },
    {
        "text": "Gratitude is not only the greatest of virtues, but the parent of all others.",
        "author": "Cicero",
        "wordIndices": [0, 4, 6, 13],
        "date": "2025-11-26"
    },
    {
        "text": "November reminds us that gratitude turns ordinary days into thanksgiving.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9],
        "date": "2025-11-27"
    },
    {
        "text": "In November, we celebrate the harvest of love, laughter, and memories.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-11-28"
    },
    {
        "text": "November is the month when gratitude fills our hearts and homes.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 10],
        "date": "2025-11-29"
    },
    {
        "text": "November ends with hearts full of gratitude and hope for tomorrow.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 10],
        "date": "2025-11-30"
    },
    {
        "text": "December brings the magic of winter and the warmth of holiday spirit.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 10],
        "date": "2025-12-01"
    },
    {
        "text": "December is the month of giving, sharing, and spreading joy.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 7],
        "date": "2025-12-02"
    },
    {
        "text": "In December, we light candles against the darkness and kindle hope in our hearts.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 11],
        "date": "2025-12-03"
    },
    {
        "text": "December whispers of snow, warmth, and the magic of the season.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 9],
        "date": "2025-12-04"
    },
    {
        "text": "The best way to spread Christmas cheer is singing loud for all to hear.",
        "author": "Buddy the Elf",
        "wordIndices": [1, 4, 6, 12],
        "date": "2025-12-05"
    },
    {
        "text": "December is the month when miracles happen and dreams come true.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 10],
        "date": "2025-12-06"
    },
    {
        "text": "In December, we celebrate the gift of love, family, and friendship.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 9],
        "date": "2025-12-07"
    },
    {
        "text": "December brings the joy of giving and the warmth of receiving.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 9],
        "date": "2025-12-08"
    },
    {
        "text": "The magic of December lies in the love we share with others.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 11],
        "date": "2025-12-09"
    },
    {
        "text": "December is the month of twinkling lights and glowing hearts.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 8],
        "date": "2025-12-10"
    },
    {
        "text": "In December, we wrap our love in ribbons and share it with the world.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 11],
        "date": "2025-12-11"
    },
    {
        "text": "December teaches us that the greatest gifts cannot be wrapped.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9],
        "date": "2025-12-12"
    },
    {
        "text": "The spirit of December is found in acts of kindness and generosity.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 10],
        "date": "2025-12-13"
    },
    {
        "text": "December is the month when we count our blessings and share our joy.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 6, 11],
        "date": "2025-12-14"
    },
    {
        "text": "In December, every snowflake is a reminder of life's unique beauty.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 5, 10],
        "date": "2025-12-15"
    },
    {
        "text": "December brings the warmth of family gatherings and cherished traditions.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 8],
        "date": "2025-12-16"
    },
    {
        "text": "The beauty of December is in the love we give and receive.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 10],
        "date": "2025-12-17"
    },
    {
        "text": "December is the month of hope, peace, and goodwill toward all.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 4, 8],
        "date": "2025-12-18"
    },
    {
        "text": "In December, we light up the world with our love and kindness.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 10],
        "date": "2025-12-19"
    },
    {
        "text": "December reminds us that the best gifts come from the heart.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9],
        "date": "2025-12-20"
    },
    {
        "text": "The magic of December is in the memories we create together.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-12-21"
    },
    {
        "text": "December is the month when love multiplies and joy overflows.",
        "author": "Anonymous",
        "wordIndices": [0, 2, 5, 8],
        "date": "2025-12-22"
    },
    {
        "text": "In December, we celebrate the miracle of love made manifest.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 8],
        "date": "2025-12-23"
    },
    {
        "text": "December brings the gift of peace on earth and goodwill to all.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 10],
        "date": "2025-12-24"
    },
    {
        "text": "Christmas is not a time nor a season, but a state of mind.",
        "author": "Calvin Coolidge",
        "wordIndices": [0, 3, 7, 12],
        "date": "2025-12-25"
    },
    {
        "text": "December 26th reminds us that the spirit of giving lasts all year long.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 12],
        "date": "2025-12-26"
    },
    {
        "text": "In December, we carry the light of love into the new year.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 10],
        "date": "2025-12-27"
    },
    {
        "text": "December teaches us that every ending is a new beginning.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 5, 9],
        "date": "2025-12-28"
    },
    {
        "text": "The last days of December are filled with reflection and hope.",
        "author": "Anonymous",
        "wordIndices": [1, 3, 6, 9],
        "date": "2025-12-29"
    },
    {
        "text": "December 30th whispers that tomorrow brings new possibilities.",
        "author": "Anonymous",
        "wordIndices": [0, 1, 4, 6],
        "date": "2025-12-30"
    },
    {
        "text": "As December ends, we step forward into a new year with hope and determination.",
        "author": "Anonymous",
        "wordIndices": [1, 2, 4, 12],
        "date": "2025-12-31"
    }
];
