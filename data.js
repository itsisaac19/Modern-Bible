var books = [
    'Genesis',         'Exodus',          'Leviticus',     'Numbers',
    'Deuteronomy',     'Joshua',          'Judges',        'Ruth',
    '1Samuel',        '2Samuel',        '1Kings',       '2Kings',
    '1Chronicles',    '2Chronicles',    'Ezra',          'Nehemiah',
    'Esther',          'Job',             'Psalms',         'Proverbs',
    'Ecclesiastes',    'SongofSolomon', 'Isaiah',        'Jeremiah',
    'Lamentations',    'Ezekiel',         'Daniel',        'Hosea',
    'Joel',            'Amos',            'Obadiah',       'Jonah',
    'Micah',           'Nahum',           'Habakkuk',      'Zephaniah',
    'Haggai',          'Zechariah',       'Malachi',       'Matthew',
    'Mark',            'Luke',            'John',          'Acts',
    'Romans',          '1Corinthians',   '2Corinthians', 'Galatians',
    'Ephesians',       'Philippians',     'Colossians',    '1Thessalonians', 
    '2Thessalonians', '1Timothy',       '2Timothy',     'Titus',
    'Philemon',        'Hebrews',         'James',         '1Peter',
    '2Peter',         '1John',          '2John',        '3John',
    'Jude',            'Revelation'
];

var booksAndInfo = {
    'Genesis':  [50],
    'Exodus': [40],
    'Leviticus': [27],
    'Numbers': [36],
    'Deuteronomy': [34],
    'Joshua': [24],
    'Judges': [21],
    'Ruth': [4],
    '1Samuel': [31],
    '2Samuel': [24],
    '1Kings': [22],
    '2Kings': [25],
    '1Chronicles': [29],
    '2Chronicles': [36],
    'Ezra': [10],
    'Nehemiah': [13],
    'Esther': [10],
    'Job': [42],
    'Psalms': [150],
    'Proverbs': [31],
    'Ecclesiastes': [12],
    'SongofSolomon': [8],
    'Isaiah': [66],
    'Jeremiah': [52],
    'Lamentations': [5],
    'Ezekiel': [48],
    'Daniel': [12],
    'Hosea': [14],
    'Joel': [3],
    'Amos': [9],
    'Obadiah': [1],
    'Jonah': [4],
    'Micah': [7],
    'Nahum': [3],
    'Habakkuk': [3],
    'Zephaniah': [3],
    'Haggai': [2],
    'Zechariah': [14],
    'Malachi': [4],
    'Matthew': [28],
    'Mark': [16],
    'Luke': [24],
    'John': [21],
    'Acts': [28],
    'James': [5],
    '1Peter': [5],
    '2Peter': [3],
    '1John': [5],
    '2John': [1],
    '3John': [1],
    'Jude': [1],
    'Romans': [16],
    '1Corinthians': [16],
    '2Corinthians': [13],
    'Galatians': [6],
    'Ephesians': [6],
    'Philippians': [4],
    'Colossians': [4],
    '1Thessalonians': [5],
    '2Thessalonians': [3],
    '1Timothy': [6],
    '2Timothy': [4],
    'Titus': [3],
    'Philemon': [1],
    'Hebrews': [13],
    'Revelation': [22]
}

var masterArray = 
{
    "Genesis":{
       "chapterCount":50,
       "chapters":[0,31,25,31,18,16,21,24,27,33,26,32,38,22,18,24,22,29,32,32,20,24,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,57,23,38,34,34,28,34,31,22,33]
    },
    "Exodus":{
       "chapterCount":40,
       "chapters":[0,25,22,31,23,30,31,27,16,36,26,27,25,31,33,37,18,37,40,43,21,18,46,38,35,35,23,38,35,22,29,22,31,25,43,32,35,29,10,51,22]
    },
    "Leviticus":{
       "chapterCount":27,
       "chapters":[0,17,17,16,35,19,30,38,24,36,20,8,47,59,30,16,33,34,58,37,24,33,23,55,27,44,17,46]
    },
    "Numbers":{
       "chapterCount":36,
       "chapters":[0,54,31,34,27,51,49,89,26,23,36,35,16,45,33,50,13,41,32,22,25,35,29,18,65,41,30,23,31,16,40,54,29,34,42,54,56]
    },
    "Deuteronomy":{
       "chapterCount":34,
       "chapters":[0,46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12]
    },
    "Joshua":{
       "chapterCount":24,
       "chapters":[0,18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33]
    },
    "Judges":{
       "chapterCount":21,
       "chapters":[0,36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25]
    },
    "Ruth":{
       "chapterCount":4,
       "chapters":[0,22,23,18,22]
    },
    "1Samuel":{
       "chapterCount":31,
       "chapters":2
    },
    "2Samuel":{
       "chapterCount":24,
       "chapters":2
    },
    "1Kings":{
       "chapterCount":22,
       "chapters":2
    },
    "2Kings":{
       "chapterCount":25,
       "chapters":2
    },
    "1Chronicles":{
       "chapterCount":29,
       "chapters":2
    },
    "2Chronicles":{
       "chapterCount":36,
       "chapters":2
    },
    "Ezra":{
       "chapterCount":10,
       "chapters":2
    },
    "Nehemiah":{
       "chapterCount":13,
       "chapters":2
    },
    "Esther":{
       "chapterCount":10,
       "chapters":2
    },
    "Job":{
       "chapterCount":42,
       "chapters":2
    },
    "Psalms":{
       "chapterCount":150,
       "chapters":2
    },
    "Proverbs":{
       "chapterCount":31,
       "chapters":2
    },
    "Ecclesiastes":{
       "chapterCount":12,
       "chapters":2,
    },
    "SongofSolomon":{
       "chapterCount":8,
       "chapters":2
    },
    "Isaiah":{
       "chapterCount":66,
       "chapters":2
    },
    "Jeremiah":{
       "chapterCount":52,
       "chapters":2
    },
    "Lamentations":{
       "chapterCount":5,
       "chapters":2
    },
    "Ezekiel":{
       "chapterCount":48,
       "chapters":2
    },
    "Daniel":{
       "chapterCount":12,
       "chapters":2
    },
    "Hosea":{
       "chapterCount":14,
       "chapters":2
    },
    "Joel":{
       "chapterCount":3,
       "chapters":2
    },
    "Amos":{
       "chapterCount":9,
       "chapters":2
    },
    "Obadiah":{
       "chapterCount":1,
       "chapters":2
    },
    "Jonah":{
       "chapterCount":4,
       "chapters":2
    },
    "Micah":{
       "chapterCount":7,
       "chapters":2
    },
    "Nahum":{
       "chapterCount":3,
       "chapters":2
    },
    "Habakkuk":{
       "chapterCount":3,
       "chapters":2
    },
    "Zephaniah":{
       "chapterCount":3,
       "chapters":2
    },
    "Haggai":{
       "chapterCount":2,
       "chapters":2
    },
    "Zechariah":{
       "chapterCount":14,
       "chapters":2
    },
    "Malachi":{
       "chapterCount":4,
       "chapters":2
    },
    "Matthew":{
       "chapterCount":28,
       "chapters":2
    },
    "Mark":{
       "chapterCount":16,
       "chapters":2
    },
    "Luke":{
       "chapterCount":24,
       "chapters":2
    },
    "John":{
       "chapterCount":21,
       "chapters":2
    },
    "Acts":{
       "chapterCount":28,
       "chapters":2
    },
    "James":{
       "chapterCount":5,
       "chapters":2
    },
    "1Peter":{
       "chapterCount":5,
       "chapters":2
    },
    "2Peter":{
       "chapterCount":3,
       "chapters":2,
    },
    "1John":{
       "chapterCount":5,
       "chapters":2
    },
    "2John":{
       "chapterCount":1,
       "chapters":2
    },
    "3John":{
       "chapterCount":1,
       "chapters":2
    },
    "Jude":{
       "chapterCount":1,
       "chapters":2
    },
    "Romans":{
       "chapterCount":16,
       "chapters":2
    },
    "1Corinthians":{
       "chapterCount":16,
       "chapters":2
    },
    "2Corinthians":{
       "chapterCount":13,
       "chapters":2
    },
    "Galatians":{
       "chapterCount":6,
       "chapters":2
    },
    "Ephesians":{
       "chapterCount":6,
       "chapters":2
    },
    "Philippians":{
       "chapterCount":4,
       "chapters":2,
    },
    "Colossians":{
       "chapterCount":4,
       "chapters":2
    },
    "1Thessalonians":{
       "chapterCount":5,
       "chapters":2
    },
    "2Thessalonians":{
       "chapterCount":3,
       "chapters":2
    },
    "1Timothy":{
       "chapterCount":6,
       "chapters":2
    },
    "2Timothy":{
       "chapterCount":4,
       "chapters":2
    },
    "Titus":{
       "chapterCount":3,
       "chapters":2
    },
    "Philemon":{
       "chapterCount":1,
       "chapters":2
    },
    "Hebrews":{
       "chapterCount":13,
       "chapters":2,
    },
    "Revelation":{
       "chapterCount":22,
       "chapters":2 [2]
    }
};