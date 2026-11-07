// Source data for the 40 entries, in Arabic (ar), French (fr) and English (en).
// Per language: `name` (shown on the row), `scene` (the short cue after "Like"), `like` (the full analogy), `text` (the explanation).
// `keys` are search aliases shared by every language. In `code`, {{0}}, {{1}}… are replaced by the matching item of `c[lang]`.
// After editing, run: node tools/build.mjs
export const cats = [
  { id: 'basics', ar: 'الأساسيات', fr: 'Bases', en: 'Basics' },
  { id: 'git', ar: 'Git', fr: 'Git', en: 'Git' },
  { id: 'web', ar: 'الويب وAPI', fr: 'Web et API', en: 'Web and API' },
  { id: 'front', ar: 'الواجهة الأمامية', fr: 'Frontend', en: 'Frontend' },
  { id: 'data', ar: 'البيانات', fr: 'Données', en: 'Data' },
  { id: 'devops', ar: 'DevOps', fr: 'DevOps', en: 'DevOps' },
  { id: 'security', ar: 'الأمان', fr: 'Sécurité', en: 'Security' },
];

export const terms = [
  // Basics
  { id: 'variable', cat: 'basics', term: 'Variable', keys: 'var let const',
    lang: 'JavaScript', code: `let price = 5;       // {{0}}
price = 6;           // {{1}}
console.log(price);  // 6`,
    c: { ar: ['شاي بالنعناع: 5 دراهم', 'ارتفع الثمن'], fr: ['thé à la menthe : 5 dirhams', 'le prix a augmenté'], en: ['mint tea: 5 dirhams', 'the price went up'] },
    ar: { name: 'المتغيّر', scene: 'برطمان السكر في المطبخ',
      like: 'مثل برطمان السكر في المطبخ: مكتوب عليه «سكر»، وحين يفرغ تملؤه من جديد. الاسم ثابت والمحتوى يتغيّر.',
      text: 'المتغيّر مكان في الذاكرة له اسم، يحفظ قيمة لتعود إليها لاحقًا. ويمكنك تغيير قيمته متى شئت.' },
    fr: { name: 'Variable', scene: 'le bocal de sucre dans la cuisine',
      like: "Comme le bocal de sucre dans la cuisine : l'étiquette dit « sucre », et quand il est vide, on le remplit. Le nom reste, le contenu change.",
      text: "Une variable est un emplacement nommé en mémoire qui garde une valeur, pour la réutiliser plus tard. Sa valeur peut changer quand on veut." },
    en: { name: 'Variable', scene: 'the sugar jar in the kitchen',
      like: 'Like the sugar jar in the kitchen: the label says “sugar”, and when it runs out you refill it. The name stays, the contents change.',
      text: 'A variable is a named place in memory that holds a value, so you can use it again later. You can change its value whenever you need to.' } },

  { id: 'function', cat: 'basics', term: 'Function', keys: 'fonction method methode',
    lang: 'JavaScript', code: `function add(a, b) {
  return a + b;
}

add(2, 3);  // 5`,
    ar: { name: 'الدالّة', scene: 'بائعة المسمّن',
      like: 'مثل بائعة المسمّن في السوق: تعطيها العجين (المُدخل) فتعيد إليك مسمّنًا (المُخرج)، ولا يلزمك أن تعرف كيف تصنعه في كل مرة.',
      text: 'الدالّة مجموعة تعليمات لها اسم. تكتبها مرة واحدة، ثم تستدعيها كلما احتجت إليها بقيم مختلفة.' },
    fr: { name: 'Fonction', scene: 'la vendeuse de msemmen',
      like: "Comme la vendeuse de msemmen au souk : vous lui donnez la pâte (l'entrée), elle vous rend un msemmen (la sortie). Inutile de savoir comment elle s'y prend.",
      text: "Une fonction est un ensemble d'instructions qui porte un nom. On l'écrit une fois, puis on l'appelle autant de fois qu'on veut, avec des valeurs différentes." },
    en: { name: 'Function', scene: 'the msemmen seller',
      like: "Like the msemmen seller at the souk: you hand over the dough (the input) and get back a msemmen (the output). You don't need to know how she makes it.",
      text: 'A function is a named set of instructions. You write it once, then call it as many times as you like, with different values.' } },

  { id: 'loop', cat: 'basics', term: 'Loop', keys: 'boucle for while',
    lang: 'JavaScript', code: `const notes = [10, 20, 50];

for (const note of notes) {
  console.log(note + " dh");
}`,
    ar: { name: 'الحلقة التكرارية', scene: 'سقّاء ساحة جامع الفنا',
      like: 'مثل السقّاء في ساحة جامع الفنا: يمرّ على الناس واحدًا تلو الآخر، يسقي كلًّا منهم كأسًا، ويتوقف حين تفرغ القِربة.',
      text: 'الحلقة تكرّر العمل نفسه مرات عديدة دون إعادة كتابة الكود. وتتوقف حين تنتهي العناصر أو حين يصبح الشرط خاطئًا.' },
    fr: { name: 'Boucle', scene: "le porteur d'eau de Jemaa el-Fna",
      like: "Comme le porteur d'eau de Jemaa el-Fna : il passe d'une personne à l'autre, sert un gobelet à chacune, et s'arrête quand l'outre est vide.",
      text: "Une boucle répète le même travail plusieurs fois sans réécrire le code. Elle s'arrête quand les éléments sont épuisés ou qu'une condition devient fausse." },
    en: { name: 'Loop', scene: 'the water seller in Jemaa el-Fna',
      like: 'Like the water seller in Jemaa el-Fna: he goes from person to person, pours each one a cup, and stops when the waterskin is empty.',
      text: 'A loop repeats the same work many times without rewriting the code. It stops when the items run out or a condition turns false.' } },

  { id: 'array', cat: 'basics', term: 'Array', keys: 'tableau liste list index',
    lang: 'JavaScript', code: `const veggies = ["tomato", "potato", "carrot"];

veggies[0];       // "tomato"
veggies.length;   // 3`,
    ar: { name: 'المصفوفة', scene: 'مقاعد الطاكسي الكبير',
      like: 'مثل مقاعد الطاكسي الكبير: لكل مقعد رقم، والمقعد الأول بجانب السائق رقمه 0.',
      text: 'المصفوفة قائمة مرتّبة من القيم داخل متغيّر واحد، لكل قيمة رقم يُسمّى الفهرس. ويبدأ الفهرس من 0 لا من 1.' },
    fr: { name: 'Tableau', scene: "les places d'un grand taxi",
      like: "Comme les places d'un grand taxi : chaque place a un numéro, et la première, à côté du chauffeur, porte le numéro 0.",
      text: "Un tableau est une liste ordonnée de valeurs dans une seule variable, chacune repérée par un numéro (son index). L'index commence à 0, pas à 1." },
    en: { name: 'Array', scene: 'the seats of a grand taxi',
      like: 'Like the seats of a grand taxi: every seat has a number, and the first one, next to the driver, is seat 0.',
      text: 'An array is an ordered list of values in a single variable, each with a number (its index). The index starts at 0, not 1.' } },

  { id: 'bug', cat: 'basics', term: 'Bug', keys: 'debug debugging erreur error',
    lang: 'JavaScript', code: `const total = "10" + 5;
console.log(total);  // {{0}}

// {{1}}`,
    c: { ar: ['"105" وليس 15', 'الإصلاح: Number("10") + 5'], fr: ['"105", pas 15', 'correction : Number("10") + 5'], en: ['"105", not 15', 'fix: Number("10") + 5'] },
    ar: { name: 'الخلل البرمجي', scene: 'قائمة المشتريات الناقصة',
      like: 'مثل أن ترسل أحدًا إلى البقّال بقائمة مكتوب فيها «2 بطاطس» وأنت تقصد كيلوغرامين، فيعود بحبّتين فقط. نفّذ ما كتبتَ لا ما قصدتَ.',
      text: 'الخلل خطأ في الكود يجعل البرنامج يتصرّف على غير ما توقّعت. والتصحيح (Debugging) هو البحث عن سببه وإصلاحه.' },
    fr: { name: 'Bug', scene: 'la liste de courses incomplète',
      like: "Comme envoyer quelqu'un chez l'épicier avec une liste qui dit « 2 pommes de terre » alors que vous vouliez 2 kilos : il rapporte deux pommes de terre. Il a fait ce que vous avez écrit, pas ce que vous vouliez.",
      text: "Un bug est une erreur dans le code qui fait faire au programme autre chose que prévu. Le débogage consiste à en trouver la cause et à la corriger." },
    en: { name: 'Bug', scene: 'the shopping list missing a word',
      like: 'Like sending someone to the corner shop with a list that says “2 potatoes” when you meant 2 kilos: they come back with two potatoes. They did what you wrote, not what you meant.',
      text: "A bug is a mistake in the code that makes the program do something you didn't expect. Debugging is the work of finding its cause and fixing it." } },

  { id: 'async-await', cat: 'basics', term: 'Async/await', keys: 'async await promise asynchrone',
    lang: 'JavaScript', code: `async function getMenu() {
  const res = await fetch("/api/menu");
  const data = await res.json();
  return data;
}`,
    ar: { name: 'الانتظار غير المتزامن', scene: 'الملابس عند محلّ التنظيف',
      like: 'مثل ترك ملابسك عند محلّ التنظيف: لا تجلس هناك منتظرًا، بل تقضي شأنًا آخر، ويتصلون بك حين تجهز.',
      text: 'تتيح لك async/await انتظار عملية بطيئة (كاستجابة الخادم) دون أن يتوقف البرنامج كله. وتعني «await»: انتظر هنا حتى تصل النتيجة.' },
    fr: { name: 'Async/await', scene: 'les vêtements au pressing',
      like: "Comme déposer vos vêtements au pressing : vous ne restez pas assis à attendre. Vous faites autre chose, et on vous appelle quand c'est prêt.",
      text: "Async/await permet d'attendre une opération lente (une réponse du serveur, par exemple) sans bloquer tout le programme. « await » veut dire : attends ici que le résultat arrive." },
    en: { name: 'Async/await', scene: "clothes at the dry cleaner's",
      like: "Like leaving your clothes at the dry cleaner's: you don't sit there waiting. You go and do something else, and they call you when it's ready.",
      text: 'Async/await lets you wait for something slow (such as a server response) without freezing the whole program. “await” means: pause here until the result arrives.' } },

  // Git
  { id: 'git', cat: 'git', term: 'Git', keys: 'version control versioning',
    lang: 'Terminal', code: `git init
git status
git log --oneline`,
    ar: { name: 'Git', scene: 'دفتر النصوص في المدرسة',
      like: 'مثل دفتر النصوص في المدرسة: يُدوَّن فيه كل درس بتاريخه، فإن غبت أسبوعًا فتحته وعرفت أين توقّف القسم بالضبط.',
      text: 'Git أداة تسجّل كل تغيير تُجريه على الكود. يمكنك الرجوع إلى أي نسخة سابقة، والعمل مع زملائك على المشروع نفسه دون أن يمحو أحدكم عمل الآخر.' },
    fr: { name: 'Git', scene: 'le cahier de textes',
      like: "Comme le cahier de textes à l'école : chaque leçon y est notée avec sa date. Absent une semaine ? On l'ouvre et on sait exactement où la classe s'est arrêtée.",
      text: "Git est un outil qui enregistre chaque modification de votre code. On peut revenir à n'importe quelle version précédente et travailler à plusieurs sur le même projet sans écraser le travail des autres." },
    en: { name: 'Git', scene: 'the class logbook at school',
      like: "Like the class logbook at school: every lesson is written down with its date. Miss a week, open the logbook, and you know exactly where the class stopped.",
      text: "Git is a tool that records every change you make to your code. You can go back to any earlier version and work with others on the same project without overwriting each other's work." } },

  { id: 'repository', cat: 'git', term: 'Repository', keys: 'repo depot github gitlab',
    lang: 'Terminal', code: `mkdir my-project && cd my-project
git init
git remote add origin https://github.com/user/my-project.git`,
    ar: { name: 'المستودع', scene: 'ألبوم صور العائلة',
      like: 'مثل ألبوم صور العائلة: فيه صور اليوم وصور الماضي مرتّبةً، ويمكن لكل فرد من العائلة أن يحتفظ بنسخته.',
      text: 'المستودع (repo) هو مجلّد المشروع مع سجلّه الكامل الذي يحفظه Git. هناك مستودع محلّي على حاسوبك، ومستودع بعيد على GitHub أو GitLab.' },
    fr: { name: 'Dépôt', scene: "l'album photo de famille",
      like: "Comme l'album photo de la famille : il garde les photos d'aujourd'hui et celles d'autrefois, bien rangées, et chacun dans la famille peut en avoir sa copie.",
      text: "Un dépôt (repository, ou repo) est le dossier du projet avec tout l'historique que Git conserve. Il y a un dépôt local sur votre ordinateur et un dépôt distant sur GitHub ou GitLab." },
    en: { name: 'Repository', scene: 'the family photo album',
      like: "Like the family photo album: it holds today's photos and old ones, all in order, and anyone in the family can keep their own copy.",
      text: 'A repository (repo) is the project folder together with the full history Git keeps for it. There is a local repo on your computer and a remote one on GitHub or GitLab.' } },

  { id: 'commit', cat: 'git', term: 'Commit', keys: 'git commit snapshot',
    lang: 'Terminal', code: `git add index.html
git commit -m "Add contact page"`,
    ar: { name: 'الإيداع', scene: 'صورة الطاجين في كل مرحلة',
      like: 'مثل أن تلتقط صورة لطاجين أمّك في كل مرحلة: الخضر، ثم اللحم، ثم الطبق جاهزًا. فإن احترق بعد ذلك عرفت إلى أين ترجع.',
      text: 'الإيداع (Commit) لقطة للكود في لحظة معيّنة، مع رسالة تشرح ما الذي تغيّر. لكل إيداع معرّف خاص، ويمكنك العودة إليه متى شئت.' },
    fr: { name: 'Commit', scene: 'une photo du tajine à chaque étape',
      like: "Comme photographier le tajine de votre mère à chaque étape : les légumes, puis la viande, puis le plat prêt. S'il brûle ensuite, vous savez où revenir.",
      text: "Un commit est un instantané de votre code à un moment donné, avec un message qui explique ce qui a changé. Chaque commit a son identifiant, et on peut y revenir à tout moment." },
    en: { name: 'Commit', scene: 'a photo of the tagine at each step',
      like: "Like photographing your mother's tagine at every stage: vegetables in, meat added, ready to serve. If it burns later, you know where to go back to.",
      text: 'A commit is a snapshot of your code at a given moment, with a message explaining what changed. Each commit has its own ID, and you can return to it whenever you want.' } },

  { id: 'branch', cat: 'git', term: 'Branch', keys: 'branche git switch checkout',
    lang: 'Terminal', code: `git switch -c feature/login
# {{0}}
git switch main`,
    c: { ar: ['... اعمل وأنشئ إيداعات ...'], fr: ['... travailler et faire des commits ...'], en: ['... work and commit ...'] },
    ar: { name: 'الفرع', scene: 'زقاق في المدينة القديمة',
      like: 'مثل زقاق في المدينة القديمة: تغادر الشارع الرئيسي وتتجوّل في الزقاق، ثم تعود إلى الشارع نفسه، والشارع الرئيسي لم يتغيّر.',
      text: 'الفرع خطّ عمل مستقل عن الكود الرئيسي (main). تجرّب فيه ميزة جديدة دون أن تُفسد النسخة التي تعمل.' },
    fr: { name: 'Branche', scene: 'une ruelle de la vieille médina',
      like: "Comme une ruelle de la vieille médina : vous quittez la grande rue, vous vous promenez dans la ruelle, puis vous revenez sur la même rue. La grande rue n'a pas changé.",
      text: "Une branche est une ligne de travail séparée du code principal (main). On y essaie une nouvelle fonctionnalité sans casser la version qui marche." },
    en: { name: 'Branch', scene: 'a side alley in the old medina',
      like: "Like a side alley in the old medina: you leave the main street, wander down the alley, then come back to the same street. The main street hasn't changed.",
      text: 'A branch is a separate line of work, apart from the main code (main). You try a new feature on it without breaking the version that works.' } },

  { id: 'merge', cat: 'git', term: 'Merge', keys: 'fusion conflict conflit rebase',
    lang: 'Terminal', code: `git switch main
git merge feature/login`,
    ar: { name: 'الدمج', scene: 'خيّاطتان على قفطان واحد',
      like: 'مثل خيّاطتين تعملان على القفطان نفسه: إحداهما تخيط الأكمام والأخرى الصدر، ثم تُجمع القطع في النهاية. وإن خاطت كلتاهما الموضع نفسه، فلا بدّ أن تحسم إحداهما.',
      text: 'الدمج يضمّ عمل فرع إلى فرع آخر. وإذا غيّر الطرفان الأسطر نفسها، يتوقف Git ويطلب منك الاختيار (تعارض الدمج).' },
    fr: { name: 'Fusion (merge)', scene: 'deux couturières sur un caftan',
      like: "Comme deux couturières sur le même caftan : l'une fait les manches, l'autre le devant, et à la fin on assemble. Si les deux ont cousu au même endroit, il faut trancher.",
      text: "Le merge réunit le travail d'une branche dans une autre. Si les deux côtés ont modifié les mêmes lignes, Git s'arrête et vous demande de choisir (un conflit de fusion)." },
    en: { name: 'Merge', scene: 'two seamstresses on one caftan',
      like: 'Like two seamstresses working on the same caftan: one does the sleeves, the other the front, and at the end the pieces are joined. If both stitched the same spot, someone has to decide.',
      text: 'Merge brings the work of one branch into another. If both sides changed the same lines, Git stops and asks you to choose (a merge conflict).' } },

  { id: 'pull-request', cat: 'git', term: 'Pull request', keys: 'pr merge request mr code review',
    lang: 'Terminal', code: `git push -u origin feature/login
gh pr create --title "Add login"`,
    ar: { name: 'طلب الدمج', scene: 'طلب عند المقدّم',
      like: 'مثل طلب تقدّمه إلى المقدّم: يطّلع عليه، وقد يعيده إليك لتصحّح شيئًا، وحين يكتمل كل شيء يوقّعه.',
      text: 'طلب الدمج (Pull request) طلب على GitHub لإدخال عمل فرعك إلى main. يقرأ زملاؤك الكود ويعلّقون عليه، ثم يوافقون.' },
    fr: { name: 'Pull request', scene: 'une demande au moqaddem',
      like: "Comme une demande déposée chez le moqaddem : il l'examine, vous la renvoie peut-être avec des corrections, et quand tout est en ordre, il la signe.",
      text: "Une pull request (PR) est une demande sur GitHub pour intégrer le travail de votre branche dans main. Vos collègues lisent le code, commentent, puis l'approuvent." },
    en: { name: 'Pull request', scene: 'a request to the moqaddem',
      like: 'Like handing a request to the moqaddem, the neighbourhood official: he looks it over, maybe sends it back with corrections, and once everything is in order he signs it.',
      text: "A pull request (PR) is a request on GitHub to bring your branch's work into main. Teammates read the code, leave comments, and then approve it." } },

  { id: 'clone', cat: 'git', term: 'Clone', keys: 'git clone download telecharger fork',
    lang: 'Terminal', code: `git clone https://github.com/user/project.git
cd project`,
    ar: { name: 'الاستنساخ', scene: 'وصفة حريرة الجدّة',
      like: 'مثل أن تنقل وصفة حريرة جدّتك بكل تفاصيلها: صارت لديك نسختك تعدّلها كما تشاء، وبقي الأصل عندها.',
      text: 'الاستنساخ (Clone) ينزّل نسخة كاملة من مستودع على GitHub إلى حاسوبك، بسجلّه كله، لتعمل عليه محليًّا.' },
    fr: { name: 'Clone', scene: 'la recette de harira de grand-mère',
      like: "Comme recopier la recette de harira de votre grand-mère dans les moindres détails : vous avez votre copie à modifier comme vous voulez, et l'original reste chez elle.",
      text: "Cloner, c'est télécharger une copie complète d'un dépôt GitHub sur votre ordinateur, avec tout son historique, pour travailler en local." },
    en: { name: 'Clone', scene: "grandma's harira recipe",
      like: "Like copying your grandmother's harira recipe down to the last detail: now you have your own copy to change as you like, and the original stays with her.",
      text: 'Clone downloads a full copy of a repo from GitHub to your computer, with its entire history, so you can work on it locally.' } },

  // Web and API
  { id: 'http', cat: 'web', term: 'HTTP', keys: 'https request response get post protocol protocole',
    lang: 'HTTP', code: `GET /api/terms HTTP/1.1
Host: example.com
Accept: application/json`,
    ar: { name: 'HTTP', scene: 'رسالة في مكتب البريد',
      like: 'مثل رسالة في مكتب البريد: تحمل عنوانًا (URL) ونوع الطلب (GET أو POST) والمحتوى، ويعود إليك الردّ في رسالة أخرى.',
      text: 'HTTP هو البروتوكول الذي يتخاطب به المتصفّح مع الخادم. يرسل المتصفّح طلبًا (GET أو POST...)، فيردّ الخادم باستجابة فيها رمز حالة وبيانات.' },
    fr: { name: 'HTTP', scene: 'une lettre à la poste',
      like: "Comme une lettre à la poste : elle porte une adresse (l'URL), un type de demande (GET ou POST) et un contenu, et la réponse revient dans une autre lettre.",
      text: "HTTP est le protocole qu'utilise le navigateur pour parler au serveur. Le navigateur envoie une requête (GET, POST...), le serveur renvoie une réponse avec un code de statut et des données." },
    en: { name: 'HTTP', scene: 'a letter at the post office',
      like: 'Like a letter at the post office: it carries an address (the URL), a kind of request (GET or POST) and its contents, and the reply comes back in another letter.',
      text: 'HTTP is the protocol a browser uses to talk to a server. The browser sends a request (GET, POST...), and the server sends back a response with a status code and data.' } },

  { id: 'api', cat: 'web', term: 'API', keys: 'application programming interface interface',
    lang: 'JavaScript', code: `const res = await fetch("https://api.example.com/weather");
const weather = await res.json();

console.log(weather.temperature);`,
    ar: { name: 'واجهة البرمجة', scene: 'نادل المقهى',
      like: 'مثل النادل في المقهى: لا تدخل المطبخ أبدًا. تقول له «قهوة بالحليب ومسمّن»، فيذهب إلى المطبخ ويعود بطلبك.',
      text: 'واجهة البرمجة (API) طريقة تتيح لبرنامج أن يتحدّث مع برنامج آخر. تحدّد لك ما يمكنك طلبه، وكيف تطلبه، وما الذي ستتلقّاه، دون أن تعرف ما يجري في الداخل.' },
    fr: { name: 'API', scene: 'le serveur du café',
      like: "Comme le serveur au café : vous n'entrez jamais en cuisine. Vous lui dites « un café au lait et un msemmen », il va en cuisine et vous rapporte votre commande.",
      text: "Une API permet à un programme de parler à un autre. Elle dit ce qu'on peut demander, comment le demander et ce qu'on recevra, sans savoir ce qui se passe à l'intérieur." },
    en: { name: 'API', scene: 'the café waiter',
      like: 'Like the waiter in a café: you never go into the kitchen. You tell him “a coffee with milk and a msemmen”, he goes to the kitchen and brings back your order.',
      text: "An API is a way for one program to talk to another. It tells you what you can ask for, how to ask, and what you'll get back, without knowing what happens inside." } },

  { id: 'rest', cat: 'web', term: 'REST', keys: 'restful api crud get post put delete',
    lang: 'HTTP', code: `GET    /terms       # {{0}}
GET    /terms/42    # {{1}}
POST   /terms       # {{2}}
DELETE /terms/42    # {{3}}`,
    c: { ar: ['جلب الكل', 'جلب واحد', 'إضافة واحد', 'حذفه'], fr: ['tout lire', 'en lire un', 'en ajouter un', 'le supprimer'], en: ['get all', 'get one', 'add one', 'delete it'] },
    ar: { name: 'REST', scene: 'قائمة المقهى',
      like: 'مثل قائمة المقهى: لكل صنف اسم (شاي، قهوة، عصير)، وهناك أفعال معدودة معروفة: اطلب، أضف، غيّر، ألغِ.',
      text: 'REST أسلوب شائع لتصميم واجهات البرمجة: لكل شيء عنوان URL (مورد)، وتستعمل عليه أفعال HTTP: GET للقراءة، وPOST للإضافة، وPUT للتعديل، وDELETE للحذف.' },
    fr: { name: 'REST', scene: 'la carte du café',
      like: "Comme la carte d'un café : chaque article a un nom (thé, café, jus), et il n'existe que quelques actions connues : commander, ajouter, modifier, annuler.",
      text: "REST est une façon courante de concevoir une API : chaque chose a une URL (une ressource), et on utilise les verbes HTTP : GET pour lire, POST pour ajouter, PUT pour modifier, DELETE pour supprimer." },
    en: { name: 'REST', scene: 'the café menu',
      like: 'Like a café menu: every item has a name (tea, coffee, juice), and there are only a few known actions: order, add, change, cancel.',
      text: 'REST is a common way to design an API: every thing has a URL (a resource), and you use HTTP verbs on it: GET to read, POST to add, PUT to update, DELETE to remove.' } },

  { id: 'json', cat: 'web', term: 'JSON', keys: 'javascript object notation format data objet',
    lang: 'JSON', code: `{
  "bread": 4,
  "tea": 1,
  "sugar_kg": 2,
  "paid": false
}`,
    ar: { name: 'JSON', scene: 'قائمة مشتريات الأم',
      like: 'مثل قائمة المشتريات التي تكتبها لك أمّك: خبز 4، شاي 1، سكر 2 كيلو. كل صنف باسمه وكميته.',
      text: 'JSON صيغة نصية تنظّم البيانات في مفاتيح وقيم (key: value). يسهل على الإنسان قراءتها وعلى الآلة تحليلها، ولهذا تعتمدها أغلب واجهات البرمجة.' },
    fr: { name: 'JSON', scene: 'la liste de courses de maman',
      like: "Comme la liste de courses que votre mère vous écrit : pain 4, thé 1, sucre 2 kilos. Chaque article avec son nom et sa quantité.",
      text: "JSON est un format texte qui organise les données en clés et valeurs (clé : valeur). Facile à lire pour un humain comme pour une machine, il est utilisé par presque toutes les API." },
    en: { name: 'JSON', scene: "mum's shopping list",
      like: 'Like the shopping list your mother writes for you: bread 4, tea 1, sugar 2 kilos. Every item with its name and how much.',
      text: "JSON is a text format that organises data as keys and values (key: value). It's easy for people to read and for machines to parse, which is why almost every API uses it." } },

  { id: 'endpoint', cat: 'web', term: 'Endpoint', keys: 'route url api',
    lang: 'JavaScript', code: `app.get("/api/terms/:id", (req, res) => {
  res.json(terms[req.params.id]);
});`,
    ar: { name: 'نقطة النهاية', scene: 'شبابيك المقاطعة',
      like: 'مثل الشبابيك في مكتب المقاطعة: شبّاك للبطاقة الوطنية وآخر للحالة المدنية. كلٌّ يؤدّي مهمة واحدة، وعليك أن تقصد الشبّاك الصحيح.',
      text: 'نقطة النهاية (Endpoint) عنوان URL محدّد في واجهة البرمجة يؤدّي مهمة واحدة. لكل نقطة طريقة (GET أو POST...) وتعيد بيانات محدّدة.' },
    fr: { name: 'Endpoint', scene: "les guichets de l'arrondissement",
      like: "Comme les guichets de l'arrondissement : un pour la carte nationale, un pour l'état civil. Chacun fait une seule chose, et il faut aller au bon.",
      text: "Un endpoint est une URL précise d'une API qui accomplit une tâche. Chaque endpoint a une méthode (GET, POST...) et renvoie des données précises." },
    en: { name: 'Endpoint', scene: 'the counters at the town hall',
      like: 'Like the counters at the local administration office: one for the national ID card, one for civil records. Each does one job, and you need the right one.',
      text: 'An endpoint is a specific URL in an API that does one job. Each endpoint has a method (GET, POST...) and returns specific data.' } },

  { id: 'status-code', cat: 'web', term: 'Status code', keys: '200 404 500 401 403 http error erreur',
    lang: 'JavaScript', code: `const res = await fetch("/api/terms/999");

if (res.status === 404) {
  console.log("{{0}}");
}`,
    c: { ar: ['هذا المصطلح غير موجود'], fr: ["Ce terme n'existe pas"], en: ['This term does not exist'] },
    ar: { name: 'رمز الحالة', scene: 'جواب البقّال',
      like: 'مثل أجوبة بقّال الحيّ: 200 «تفضّل»، 404 «غير متوفّر»، 401 «ادفع أولًا»، 500 «الثلاجة معطّلة»، والمشكلة عنده لا عندك.',
      text: 'رمز الحالة رقم يعيده الخادم مع كل استجابة ليخبرك بما حدث: 200 كل شيء على ما يرام، 404 غير موجود، 500 خطأ في الخادم.' },
    fr: { name: 'Code de statut', scene: "la réponse de l'épicier",
      like: "Comme les réponses de l'épicier du coin : 200 « tenez », 404 « on n'en a pas », 401 « payez d'abord », 500 « le frigo est en panne », et là, le problème est chez lui, pas chez vous.",
      text: "Un code de statut est un nombre que le serveur renvoie avec chaque réponse pour dire ce qui s'est passé : 200 tout va bien, 404 introuvable, 500 erreur du serveur." },
    en: { name: 'Status code', scene: "the shopkeeper's answer",
      like: "Like the corner shopkeeper's answers: 200 “here you go”, 404 “we don't have it”, 401 “pay first”, 500 “the fridge broke”, and that problem is his, not yours.",
      text: 'A status code is a number the server returns with every response to tell you what happened: 200 all good, 404 not found, 500 a server error.' } },

  { id: 'cors', cat: 'web', term: 'CORS', keys: 'cross origin access-control-allow-origin',
    lang: 'JavaScript', code: `// {{0}}
res.set("Access-Control-Allow-Origin", "https://example.com");`,
    c: { ar: ['على الخادم (Express)'], fr: ['côté serveur (Express)'], en: ['on the server (Express)'] },
    ar: { name: 'CORS', scene: 'حارس الإقامة',
      like: 'مثل حارس باب الإقامة السكنية: لا يسمح لأيّ كان بالدخول، ولا بدّ أن يقول له أحد السكان «هذا الشخص معي».',
      text: 'CORS قاعدة في المتصفّح تمنع موقعًا من جلب بيانات من نطاق آخر، ما لم يسمح خادم ذلك النطاق بذلك عبر الترويسة Access-Control-Allow-Origin.' },
    fr: { name: 'CORS', scene: 'le gardien de la résidence',
      like: "Comme le gardien à l'entrée d'une résidence : il ne laisse pas entrer n'importe qui. Il faut qu'un habitant lui dise « cette personne est avec moi ».",
      text: "CORS est une règle du navigateur qui empêche un site de récupérer des données d'un autre domaine, sauf si le serveur de ce domaine l'autorise avec l'en-tête Access-Control-Allow-Origin." },
    en: { name: 'CORS', scene: 'the residence guard',
      like: 'Like the guard at a residence gate: he doesn\'t let just anyone in. A resident has to tell him “this person is with me”.',
      text: "CORS is a browser rule that blocks a site from fetching data from another domain, unless that domain's server allows it with the Access-Control-Allow-Origin header." } },

  // Frontend
  { id: 'html', cat: 'front', term: 'HTML', keys: 'balise tag page web markup',
    lang: 'HTML', code: `<h1>{{0}}</h1>
<p>{{1}}</p>
<button>{{2}}</button>`,
    c: { ar: ['مرحبًا', 'موقعي الأول.', 'انقر هنا'], fr: ['Bienvenue', 'Mon premier site.', 'Cliquez ici'], en: ['Welcome', 'My first website.', 'Click here'] },
    ar: { name: 'HTML', scene: 'جدران البيت',
      like: 'مثل بناء البيت: الجدران والأبواب والسقف. لم يُطلَ بعد ولم يُفرش، لكنه قائم.',
      text: 'HTML هي اللغة التي تبني هيكل صفحة الويب: العناوين والفقرات والصور والأزرار. وكل عنصر يوضع داخل وسم.' },
    fr: { name: 'HTML', scene: "les murs d'une maison",
      like: "Comme la construction d'une maison : les murs, les portes, le toit. Elle n'est ni peinte ni meublée, mais elle tient debout.",
      text: "HTML est le langage qui construit la structure d'une page web : titres, paragraphes, images, boutons. Chaque élément est placé dans une balise." },
    en: { name: 'HTML', scene: 'the walls of a house',
      like: "Like building a house: walls, doors and a roof. It isn't painted or furnished yet, but the house is standing.",
      text: 'HTML is the language that builds the structure of a web page: headings, paragraphs, images, buttons. Everything sits inside a tag.' } },

  { id: 'css', cat: 'front', term: 'CSS', keys: 'style design flexbox grid',
    lang: 'CSS', code: `h1 {
  font-size: 2rem;
  text-align: center;
}`,
    ar: { name: 'CSS', scene: 'الصباغة والزليج',
      like: 'إن كانت HTML هيكل البيت، فإن CSS هي الطلاء والزليج والأثاث. البيت نفسه، لكن كلٌّ يزيّنه على ذوقه.',
      text: 'CSS هي اللغة التي تنسّق HTML: الألوان والخطوط والمسافات، وطريقة ظهور الصفحة على الهاتف أو الحاسوب.' },
    fr: { name: 'CSS', scene: 'la peinture et le zellige',
      like: "Si HTML est la structure de la maison, CSS en est la peinture, le zellige et les meubles. Même maison, mais chacun la décore à son goût.",
      text: "CSS est le langage qui met en forme le HTML : couleurs, polices, espacements, et l'affichage sur téléphone ou sur ordinateur." },
    en: { name: 'CSS', scene: 'paint and zellige',
      like: 'If HTML is the structure of the house, CSS is the paint, the zellige and the furniture. Same house, but everyone decorates it to their taste.',
      text: 'CSS is the language that styles HTML: colours, fonts, spacing, and how the page looks on a phone or a computer.' } },

  { id: 'dom', cat: 'front', term: 'DOM', keys: 'document object model queryselector element',
    lang: 'JavaScript', code: `const title = document.querySelector("h1");
title.textContent = "{{0}}";`,
    c: { ar: ['أهلًا'], fr: ['Bonjour'], en: ['Hello'] },
    ar: { name: 'DOM', scene: 'شجرة العائلة',
      like: 'مثل شجرة العائلة: الأجداد، ثم أبناؤهم، ثم الأحفاد. ولتغيير أحدهم تصل إليه بموقعه في الشجرة.',
      text: 'DOM تمثيل صفحة HTML في ذاكرة المتصفّح على هيئة شجرة من العناصر. ويعمل JavaScript على DOM ليغيّر ما يظهر دون إعادة تحميل الصفحة.' },
    fr: { name: 'DOM', scene: "l'arbre généalogique",
      like: "Comme un arbre généalogique : les grands-parents, puis leurs enfants, puis les petits-enfants. Pour changer quelqu'un, on le retrouve à sa place dans l'arbre.",
      text: "Le DOM est la représentation d'une page HTML dans la mémoire du navigateur, sous forme d'arbre d'éléments. JavaScript agit sur le DOM pour modifier l'affichage sans recharger la page." },
    en: { name: 'DOM', scene: 'the family tree',
      like: 'Like a family tree: grandparents, then their children, then the grandchildren. To change someone, you find them by their place in the tree.',
      text: "The DOM is the browser's in-memory picture of an HTML page, shaped like a tree of elements. JavaScript works on the DOM to change what's on screen without reloading the page." } },

  { id: 'component', cat: 'front', term: 'Component', keys: 'composant react vue jsx',
    lang: 'React', code: `function Button({ label }) {
  return <button className="btn">{label}</button>;
}

<Button label="{{0}}" />`,
    c: { ar: ['إرسال'], fr: ['Envoyer'], en: ['Send'] },
    ar: { name: 'المكوّن', scene: 'قالب الآجرّ',
      like: 'مثل قالب الآجرّ: لا تشكّل كل آجرّة بيدك، بل تصنع القالب مرة واحدة وتملؤه كلما احتجت.',
      text: 'المكوّن في React قطعة من الواجهة (زر، بطاقة، قائمة) لها كودها وتنسيقها. تبنيه مرة واحدة وتعيد استعماله في أماكن كثيرة.' },
    fr: { name: 'Composant', scene: 'le moule à briques',
      like: "Comme un moule à briques : on ne façonne pas chaque brique à la main. On fabrique le moule une fois et on le remplit autant qu'il faut.",
      text: "Dans React, un composant est un morceau d'interface (bouton, carte, menu) avec son propre code et son style. On le crée une fois et on le réutilise à plusieurs endroits." },
    en: { name: 'Component', scene: 'the brick mould',
      like: "Like a brick mould: you don't shape every brick by hand. You make the mould once and fill it as many times as you need.",
      text: 'In React, a component is a piece of the interface (a button, a card, a menu) with its own code and style. You build it once and reuse it in many places.' } },

  { id: 'state', cat: 'front', term: 'State', keys: 'usestate react etat',
    lang: 'React', code: `const [goals, setGoals] = useState(0);

<button onClick={() => setGoals(goals + 1)}>
  Goals: {goals}
</button>`,
    ar: { name: 'الحالة', scene: 'لوحة النتيجة في الملعب',
      like: 'مثل لوحة النتيجة في الملعب: كلما سُجّل هدف تغيّر الرقم وتحدّثت اللوحة تلقائيًا. المباراة نفسها، والنتيجة وحدها تغيّرت.',
      text: 'الحالة (State) بيانات يحتفظ بها المكوّن وتتغيّر مع الوقت (كعدد النقرات على زر). وحين تتغيّر، يعيد React رسم المكوّن تلقائيًا.' },
    fr: { name: 'État (state)', scene: "le tableau d'affichage du stade",
      like: "Comme le tableau d'affichage au stade : à chaque but, le chiffre change et le tableau se met à jour tout seul. Même match, seul le score a bougé.",
      text: "Le state est une donnée qu'un composant garde et qui change avec le temps (comme le nombre de clics sur un bouton). Quand le state change, React redessine le composant de lui-même." },
    en: { name: 'State', scene: 'the stadium scoreboard',
      like: 'Like the scoreboard at the stadium: every time a goal goes in, the number changes and the board updates itself. Same match, only the score moved.',
      text: 'State is data a component keeps and that changes over time (like how many times a button was clicked). When state changes, React redraws the component on its own.' } },

  { id: 'props', cat: 'front', term: 'Props', keys: 'properties proprietes react parent enfant child',
    lang: 'React', code: `function Tagine({ kind, count }) {
  return <p>{count} × {kind}</p>;
}

<Tagine kind="{{0}}" count={3} />`,
    c: { ar: ['لحم بالبرقوق'], fr: ['viande aux pruneaux'], en: ['meat and prunes'] },
    ar: { name: 'الخصائص', scene: 'طلبية رئيس الطهاة',
      like: 'مثل الطلبية التي يسلّمك إياها رئيس الطهاة في المطعم: «ثلاثة طواجين باللحم». تطبخ ما طُلب منك ولا تغيّر الطلبية.',
      text: 'الخصائص (Props) قيم يمرّرها المكوّن الأب إلى المكوّن الابن. يقرؤها الابن ولا يغيّرها أبدًا، وإن لزم تغيير فالأب هو من يتولّاه.' },
    fr: { name: 'Props', scene: 'la commande du chef',
      like: "Comme la commande que le chef vous donne au restaurant : « trois tajines à la viande ». Vous préparez ce qu'on vous a dit, vous ne changez pas la commande.",
      text: "Les props sont les valeurs qu'un composant parent transmet à un composant enfant. L'enfant les lit sans jamais les modifier : si quelque chose doit changer, c'est le parent qui s'en charge." },
    en: { name: 'Props', scene: "the chef's order",
      like: "Like the order the chef hands you in a restaurant: “three meat tagines”. You cook what you were told; you don't change the order.",
      text: 'Props are the values a parent component passes to a child component. The child reads them but never changes them: if something must change, the parent changes it.' } },

  { id: 'useeffect', cat: 'front', term: 'useEffect', keys: 'hook react effet effect lifecycle',
    lang: 'React', code: `useEffect(() => {
  fetch("/api/terms")
    .then((r) => r.json())
    .then(setTerms);
}, []);`,
    ar: { name: 'useEffect', scene: 'ضوء كل غرفة',
      like: 'مثل إشعال الضوء حين تدخل غرفة: لا تضغط على الزر كل دقيقة، بل فقط حين تنتقل إلى غرفة أخرى.',
      text: 'useEffect خطّاف (hook) في React ينفّذ عملًا بعد ظهور المكوّن: جلب بيانات من واجهة برمجة، أو تشغيل مؤقّت... وتحدّد مصفوفة الاعتماديات متى يُعاد تنفيذه.' },
    fr: { name: 'useEffect', scene: 'la lumière de chaque pièce',
      like: "Comme allumer la lumière en entrant dans une pièce : on ne l'actionne pas chaque minute, seulement quand on change de pièce.",
      text: "useEffect est un hook React qui exécute un travail après l'affichage d'un composant : récupérer des données d'une API, lancer un minuteur... Son tableau de dépendances indique quand recommencer." },
    en: { name: 'useEffect', scene: 'the light in each room',
      like: "Like switching on the light when you walk into a room: you don't flick it every minute, only when you change rooms.",
      text: 'useEffect is a React hook that runs some work after a component appears: fetching data from an API, starting a timer... Its dependency array says when to run it again.' } },

  // Data
  { id: 'database', cat: 'data', term: 'Database', keys: 'base de donnees bdd db postgres mysql',
    lang: 'SQL', code: `CREATE TABLE terms (
  id       INT PRIMARY KEY,
  name     TEXT,
  category TEXT
);`,
    ar: { name: 'قاعدة البيانات', scene: 'أرشيف الجماعة',
      like: 'مثل أرشيف الجماعة: كل ملف في مكانه برقمه، فيجد الموظف ملفّك في دقيقة لأن كل شيء مرتّب.',
      text: 'قاعدة البيانات مكان منظّم لتخزين البيانات، يتيح قراءتها وإضافتها وتعديلها وحذفها بسرعة، حتى لو بلغت ملايين الأسطر.' },
    fr: { name: 'Base de données', scene: 'les archives de la commune',
      like: "Comme les archives de la commune : chaque dossier à sa place, avec un numéro, et l'employé retrouve le vôtre en une minute parce que tout est rangé.",
      text: "Une base de données est un endroit organisé pour stocker des données, afin de les lire, les ajouter, les modifier et les supprimer rapidement, même quand il y en a des millions de lignes." },
    en: { name: 'Database', scene: 'the town hall archive',
      like: 'Like the archive at the town hall: every file in its place with a number, so the clerk finds yours in a minute because everything is in order.',
      text: 'A database is an organised place to store data so you can read, add, update and delete it quickly, even when there are millions of rows.' } },

  { id: 'sql', cat: 'data', term: 'SQL', keys: 'select where query requete',
    lang: 'SQL', code: `SELECT name, price
FROM vegetables
WHERE price < 10
ORDER BY price;`,
    ar: { name: 'SQL', scene: 'طلبك من البقّال',
      like: 'مثل أن تقول للبقّال: «أعطني كل الخضر التي ثمنها أقل من 10 دراهم». أنت تقول ما تريد، وهو يعرف أين يجده.',
      text: 'SQL لغة التخاطب مع قاعدة بيانات علائقية: تحدّد ما تريد (SELECT)، ومن أين (FROM)، وبأيّ شرط (WHERE).' },
    fr: { name: 'SQL', scene: "la demande à l'épicier",
      like: "Comme dire à l'épicier : « donnez-moi tous les légumes à moins de 10 dirhams ». Vous dites ce que vous voulez, il sait où ça se trouve.",
      text: "SQL est le langage pour interroger une base de données relationnelle : on dit ce qu'on veut (SELECT), d'où (FROM) et à quelle condition (WHERE)." },
    en: { name: 'SQL', scene: 'asking the shopkeeper',
      like: 'Like telling the shopkeeper: “give me every vegetable under 10 dirhams”. You say what you want; he knows where it is.',
      text: 'SQL is the language for talking to a relational database: you say what you want (SELECT), from where (FROM) and under which condition (WHERE).' } },

  { id: 'sql-join', cat: 'data', term: 'SQL JOIN', keys: 'join jointure inner join left join',
    lang: 'SQL', code: `SELECT neighbours.name, credit.amount
FROM neighbours
JOIN credit ON credit.house_id = neighbours.house_id;`,
    ar: { name: 'الربط في SQL', scene: 'دفتر ديون البقّال',
      like: 'مثل دفتر ديون البقّال: في صفحة أسماء الجيران وأرقام بيوتهم، وفي صفحة أخرى الديون حسب رقم البيت. يجمع JOIN بينهما: من المدين وبكم.',
      text: 'JOIN يجمع أسطر جدولين (أو أكثر) اعتمادًا على عمود مشترك. يحتفظ INNER JOIN بما يوجد في الجدولين معًا، ويحتفظ LEFT JOIN بكل ما في الجدول الأيسر.' },
    fr: { name: 'Jointure SQL', scene: "le carnet de crédit de l'épicier",
      like: "Comme le carnet de crédit de l'épicier : une page liste les voisins et leur numéro de maison, une autre les dettes par numéro de maison. JOIN rassemble les deux : qui doit combien.",
      text: "Une jointure combine les lignes de deux tables (ou plus) grâce à une colonne commune. INNER JOIN ne garde que ce qui existe des deux côtés ; LEFT JOIN garde tout ce qui vient de la table de gauche." },
    en: { name: 'SQL JOIN', scene: "the shopkeeper's credit notebook",
      like: "Like the corner shopkeeper's credit notebook: one page lists the neighbours and their house numbers, another lists debts by house number. JOIN puts them together: who owes what.",
      text: "JOIN combines the rows of two (or more) tables using a shared column. INNER JOIN keeps only what's in both; LEFT JOIN keeps everything from the left table." } },

  { id: 'primary-key', cat: 'data', term: 'Primary key', keys: 'cle primaire id pk unique',
    lang: 'SQL', code: `CREATE TABLE neighbours (
  house_id INT PRIMARY KEY,
  name     TEXT NOT NULL
);`,
    ar: { name: 'المفتاح الأساسي', scene: 'رقم البطاقة الوطنية',
      like: 'مثل رقم البطاقة الوطنية: كثيرون اسمهم محمد العلوي، لكن لا يشترك اثنان في الرقم نفسه، وبه تعرف من هو بالضبط.',
      text: 'المفتاح الأساسي عمود (أو أكثر) يميّز كل سطر في الجدول تمييزًا فريدًا. لا يتكرّر ولا يكون فارغًا.' },
    fr: { name: 'Clé primaire', scene: 'le numéro de CIN',
      like: "Comme le numéro de la carte nationale (CIN) : beaucoup de gens s'appellent Mohamed Alaoui, mais deux personnes n'ont jamais le même CIN. C'est ainsi qu'on sait qui est qui.",
      text: "Une clé primaire est une colonne (ou plusieurs) qui identifie chaque ligne d'une table de façon unique. Elle ne peut ni se répéter ni être vide." },
    en: { name: 'Primary key', scene: 'the national ID number',
      like: "Like the national ID card number (CIN): plenty of people are called Mohamed Alaoui, but no two share a CIN. That's how you know exactly who is who.",
      text: "A primary key is a column (or several) that uniquely identifies each row in a table. It can't repeat and can't be empty." } },

  { id: 'orm', cat: 'data', term: 'ORM', keys: 'prisma sequelize typeorm django object relational mapping',
    lang: 'JavaScript', code: `const terms = await prisma.term.findMany({
  where: { category: "Git" },
});`,
    ar: { name: 'ORM', scene: 'الترجمان في المحكمة',
      like: 'مثل الترجمان في المحكمة: تتكلّم بلغتك، فيترجم للقاضي، ثم ينقل إليك الجواب بلغتك.',
      text: 'ORM مكتبة تتيح لك التعامل مع قاعدة البيانات بكائنات لغتك (JavaScript أو Python...) دون كتابة SQL بيدك، فهي تتولّى الترجمة إلى SQL.' },
    fr: { name: 'ORM', scene: "l'interprète au tribunal",
      like: "Comme un interprète au tribunal : vous parlez votre langue, il traduit pour le juge et vous rapporte la réponse dans la vôtre.",
      text: "Un ORM est une bibliothèque qui permet de manipuler une base de données avec les objets de votre langage (JavaScript, Python...) sans écrire de SQL à la main. Il traduit en SQL pour vous." },
    en: { name: 'ORM', scene: 'the court interpreter',
      like: 'Like an interpreter in court: you speak your language, he translates for the judge, and brings the answer back in yours.',
      text: "An ORM is a library that lets you work with a database using your language's objects (JavaScript, Python...) instead of writing SQL by hand. It translates to SQL for you." } },

  // DevOps
  { id: 'docker', cat: 'devops', term: 'Docker', keys: 'dockerfile image conteneur container',
    lang: 'Dockerfile', code: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]`,
    ar: { name: 'Docker', scene: 'حاويات ميناء طنجة المتوسط',
      like: 'مثل الحاويات في ميناء طنجة المتوسط: أيًّا كان ما بداخلها، فلها المقاس نفسه، وترفعها الرافعة نفسها، وتُشحن على أيّ سفينة.',
      text: 'Docker يحزم تطبيقك مع كل ما يحتاجه (إصدار Node والمكتبات والإعدادات) في صورة واحدة، تعمل بالطريقة نفسها على أيّ جهاز.' },
    fr: { name: 'Docker', scene: 'les conteneurs de Tanger Med',
      like: "Comme les conteneurs du port de Tanger Med : peu importe ce qu'ils contiennent, ils ont tous la même taille, sont soulevés par la même grue et montent sur n'importe quel navire.",
      text: "Docker emballe votre application avec tout ce dont elle a besoin (version de Node, bibliothèques, configuration) dans une seule image. Cette image fonctionne de la même façon sur n'importe quelle machine." },
    en: { name: 'Docker', scene: 'the containers at Tanger Med',
      like: 'Like the containers at the port of Tanger Med: whatever is inside, they all have the same size, are lifted by the same crane and fit on any ship.',
      text: 'Docker packs your application with everything it needs (Node version, libraries, settings) into a single image. That image runs the same way on any machine.' } },

  { id: 'container', cat: 'devops', term: 'Container', keys: 'conteneur docker run image',
    lang: 'Terminal', code: `docker build -t my-app .
docker run -p 3000:3000 my-app
docker ps`,
    ar: { name: 'الحاوية', scene: 'البغرير من وصفة واحدة',
      like: 'إن كانت الصورة هي وصفة البغرير، فالحاوية هي البغرير المطهوّ أمامك. وصفة واحدة، وما شئت من البغرير.',
      text: 'الحاوية نسخة قيد التشغيل من صورة Docker. يمكنك تشغيل حاويات كثيرة من الصورة نفسها، كلٌّ منها معزول عن الأخرى.' },
    fr: { name: 'Conteneur', scene: "les baghrirs d'une même recette",
      like: "Si l'image est la recette du baghrir, le conteneur est le baghrir cuit devant vous. Une seule recette, autant de baghrirs que vous voulez.",
      text: "Un conteneur est une copie en cours d'exécution d'une image Docker. On peut lancer plusieurs conteneurs à partir de la même image, chacun isolé des autres." },
    en: { name: 'Container', scene: 'baghrir from one recipe',
      like: 'If the image is the baghrir recipe, a container is the baghrir cooked in front of you. One recipe, as many as you want.',
      text: 'A container is a running copy of a Docker image. You can start many containers from the same image, each isolated from the others.' } },

  { id: 'env-variable', cat: 'devops', term: 'Environment variable', keys: 'env .env secret config',
    lang: 'JavaScript', code: `// {{0}}
// DATABASE_URL=postgres://localhost/mydb

const url = process.env.DATABASE_URL;`,
    c: { ar: ['.env (لا تضعه أبدًا في git)'], fr: ['.env (à ne jamais mettre dans git)'], en: ['.env (never commit it to git)'] },
    ar: { name: 'متغيّر البيئة', scene: 'كلمة سرّ الويفي في المقهى',
      like: 'مثل كلمة سرّ الويفي في المقهى: لا تُطبع في القائمة التي يقرؤها الجميع، بل تسأل عنها النادل. القائمة نفسها، والكلمة قد تتغيّر.',
      text: 'متغيّر البيئة قيمة تُحفظ خارج الكود (ككلمة سرّ قاعدة البيانات أو مفتاح API) كي لا تنتهي على GitHub، ويمكن أن تتغيّر حسب البيئة (dev أو prod).' },
    fr: { name: "Variable d'environnement", scene: 'le code wifi du café',
      like: "Comme le code wifi d'un café : il n'est pas imprimé sur la carte que tout le monde lit, on le demande au serveur. Même carte, mais le code peut changer.",
      text: "Une variable d'environnement est une valeur gardée hors du code (mot de passe de base de données, clé d'API) pour qu'elle ne finisse jamais sur GitHub et puisse changer selon l'environnement (dev, prod)." },
    en: { name: 'Environment variable', scene: 'the café wifi password',
      like: "Like the wifi password in a café: it isn't printed on the menu everyone reads, you ask the waiter. Same menu, but the password can change.",
      text: 'An environment variable is a value kept outside the code (a database password, an API key) so it never ends up on GitHub, and can change per environment (dev, prod).' } },

  { id: 'deploy', cat: 'devops', term: 'Deploy', keys: 'deploiement deployment hosting github pages',
    lang: 'Terminal', code: `npm run build
git push origin main
# {{0}}`,
    c: { ar: ['ينشر GitHub Pages الموقع تلقائيًا'], fr: ['GitHub Pages publie le site tout seul'], en: ['GitHub Pages publishes the site on its own'] },
    ar: { name: 'النشر', scene: 'حريرة رمضان للجيران',
      like: 'مثل أن تطبخ الحريرة في البيت وتوزّعها على الجيران في رمضان: كانت لك وحدك، والآن يستطيع الجميع أن يأخذ منها.',
      text: 'النشر هو وضع الكود على خادم ليصبح الموقع أو التطبيق متاحًا للناس على الإنترنت، لا على حاسوبك فقط.' },
    fr: { name: 'Déploiement', scene: 'la harira partagée avec les voisins',
      like: "Comme préparer la harira à la maison et la partager avec les voisins pendant le Ramadan : avant, vous seul en aviez, maintenant tout le monde peut en prendre un bol.",
      text: "Déployer, c'est mettre votre code sur un serveur pour que le site ou l'application soit accessible sur internet, et pas seulement sur votre ordinateur." },
    en: { name: 'Deploy', scene: 'Ramadan harira for the neighbours',
      like: 'Like cooking harira at home and sharing it with the neighbours during Ramadan: before, only you had it; now everyone can have a bowl.',
      text: 'Deploying means putting your code on a server so the site or app is available to people on the internet, not just on your computer.' } },

  { id: 'ci-cd', cat: 'devops', term: 'CI/CD', keys: 'ci cd github actions pipeline integration continue',
    lang: 'YAML', code: `on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test`,
    ar: { name: 'التكامل والنشر المستمرّان', scene: 'الفحص التقني للسيارة',
      like: 'مثل الفحص التقني قبل أن تعود سيارتك إلى الطريق: إن نجح كل شيء تسلّمت الورقة وانطلقت، وإلّا أصلحت العطب أولًا.',
      text: 'CI/CD أتمتة: كلما دفعت كودًا (push)، تُشغَّل الاختبارات تلقائيًا (CI)، وإن نجح كل شيء انتقل الكود إلى الإنتاج تلقائيًا (CD).' },
    fr: { name: 'CI/CD', scene: 'le contrôle technique de la voiture',
      like: "Comme la visite technique avant de reprendre la route : si tout est bon, on vous donne le papier et vous repartez. Sinon, vous réparez d'abord.",
      text: "Le CI/CD, c'est de l'automatisation : à chaque push, les tests se lancent tout seuls (CI), et si tout passe, le code part en production tout seul (CD)." },
    en: { name: 'CI/CD', scene: "the car's technical inspection",
      like: 'Like the technical inspection before your car goes back on the road: if everything passes, you get the paper and drive on. If not, you fix it first.',
      text: 'CI/CD is automation: every time you push, the tests run on their own (CI), and if everything passes, the code goes to production on its own (CD).' } },

  // Security
  { id: 'jwt', cat: 'security', term: 'JWT', keys: 'json web token jeton bearer login',
    lang: 'JavaScript', code: `const token = jwt.sign({ id: 42 }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});
// Authorization: Bearer <token>`,
    ar: { name: 'JWT', scene: 'سوار مهرجان موازين',
      like: 'مثل سوار مهرجان موازين: حين يراه الحارس في معصمك يُدخلك دون أن يسألك عن اسمك، ولا يمكنك تزويره لأنه يحمل ختمًا خاصًّا.',
      text: 'JWT (JSON Web Token) رمز موقَّع يمنحك إياه الخادم عند تسجيل الدخول. ترسله مع كل طلب، فيتحقّق الخادم من التوقيع دون الرجوع إلى قاعدة البيانات.' },
    fr: { name: 'JWT', scene: 'le bracelet de Mawazine',
      like: "Comme le bracelet du festival Mawazine : quand le vigile le voit à votre poignet, il vous laisse entrer sans demander votre nom. Et impossible de le falsifier, il porte un sceau spécial.",
      text: "Un JWT (JSON Web Token) est un jeton signé que le serveur vous remet à la connexion. Vous le renvoyez à chaque requête, et le serveur vérifie la signature sans repasser par la base de données." },
    en: { name: 'JWT', scene: 'the Mawazine wristband',
      like: "Like the wristband at the Mawazine festival: when the guard sees it on your wrist, he lets you in without asking your name. And you can't fake it, because it carries a special seal.",
      text: 'A JWT (JSON Web Token) is a signed token the server gives you when you log in. You send it back with every request, and the server checks the signature without going back to the database.' } },

  { id: 'hashing', cat: 'security', term: 'Hashing', keys: 'hash bcrypt argon2 password mot de passe salt',
    lang: 'JavaScript', code: `const hash = await bcrypt.hash("password123", 10);
const ok = await bcrypt.compare("password123", hash);
// ok === true`,
    ar: { name: 'التجزئة', scene: 'عصير الليمون',
      like: 'مثل عصير الليمون: من الليمونة تستخرج العصير، لكنك لا تستطيع أن تستعيد الليمونة من العصير، والليمونة نفسها تعطي دائمًا المذاق نفسه.',
      text: 'التجزئة (Hashing) تحوّل نصًّا (ككلمة سرّ) إلى سلسلة ثابتة من الحروف لا يمكن استرجاع النص الأصلي منها. وتُخزَّن كلمات السرّ دائمًا مجزّأةً مع ملح (bcrypt أو argon2).' },
    fr: { name: 'Hachage', scene: 'le jus de citron',
      like: "Comme le jus de citron : d'un citron on tire du jus, mais du jus on ne retrouve jamais le citron. Et le même citron donne toujours le même goût.",
      text: "Le hachage transforme un texte (un mot de passe, par exemple) en une chaîne de caractères fixe, d'où l'on ne peut pas retrouver le texte d'origine. Les mots de passe se stockent toujours hachés avec un sel (bcrypt, argon2)." },
    en: { name: 'Hashing', scene: 'lemon juice',
      like: 'Like lemon juice: from a lemon you get juice, but from the juice you can never get the lemon back. And the same lemon always gives the same taste.',
      text: "Hashing turns text (such as a password) into a fixed string of characters, and you can't get the original text back from it. Passwords should always be stored hashed with a salt (bcrypt, argon2)." } },

  { id: 'auth', cat: 'security', term: 'Authentication / authorization', keys: 'auth authn authz login permission role 401 403',
    lang: 'JavaScript', code: `if (!req.user) return res.status(401).end();      // authentication
if (req.user.role !== "admin") {
  return res.status(403).end();                    // authorization
}`,
    ar: { name: 'المصادقة والتفويض', scene: 'جواز السفر وبطاقة الصعود',
      like: 'في مطار محمد الخامس: عند المراقبة يتحقّقون من جواز سفرك (من أنت)، وعند باب الطائرة يتحقّقون من بطاقة الصعود (هل يحقّ لك ركوب هذه الطائرة).',
      text: 'المصادقة تتحقّق من هويتك (تسجيل الدخول بالبريد الإلكتروني وكلمة السرّ)، والتفويض يحدّد ما يحقّ لك فعله بعد ذلك (المشرف يستطيع الحذف، والمستخدم العادي لا).' },
    fr: { name: 'Authentification / autorisation', scene: "le passeport et la carte d'embarquement",
      like: "À l'aéroport Mohammed V : au contrôle, on vérifie votre passeport (qui vous êtes). À la porte, on vérifie votre carte d'embarquement (avez-vous le droit de monter dans cet avion).",
      text: "L'authentification vérifie qui vous êtes (connexion avec e-mail et mot de passe). L'autorisation décide de ce que vous avez le droit de faire ensuite (un admin peut supprimer, un simple utilisateur non)." },
    en: { name: 'Authentication / authorization', scene: 'passport and boarding pass',
      like: "At Mohammed V airport: at passport control they check who you are. At the gate they check your boarding pass: whether you're allowed on this plane.",
      text: "Authentication checks who you are (logging in with an email and password). Authorization decides what you're allowed to do next (an admin can delete, a regular user can't)." } },
];
