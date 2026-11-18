# Mohamed Shaltoot · MEP BIM Portfolio

- **الموقع:** https://mohamedshaltoot24.github.io
- **ملفات الموقع على GitHub:** https://github.com/mohamedshaltoot24/mohamedshaltoot24.github.io
- **لوحة التحكم:** https://app.pagescms.org
  - Home page (الكلام + الـ CV): https://app.pagescms.org/mohamedshaltoot24/mohamedshaltoot24.github.io/main/file/site
  - Projects: https://app.pagescms.org/mohamedshaltoot24/mohamedshaltoot24.github.io/main/file/projects
  - Images: https://app.pagescms.org/mohamedshaltoot24/mohamedshaltoot24.github.io/main/media/images
  - Documents (PDF): https://app.pagescms.org/mohamedshaltoot24/mohamedshaltoot24.github.io/main/media/files

موقع static على GitHub Pages، وبيتعدّل من لوحة تحكم فيها forms (Pages CMS).
تقدر تضيف مشاريع وصور وPDF وخانات جديدة من المتصفح، من غير ما تلمس أي كود.

---

## الموقع متقسم إزاي

| الملف | فيه إيه |
|---|---|
| `content/site.json` | كلام الصفحة الرئيسية: أول الصفحة، About، Skills، Experience، Contact، والـ CV |
| `content/projects.json` | المشاريع: كروت الصفحة الرئيسية + صفحة كل مشروع |
| `assets/img/` | الصور |
| `assets/files/` | ملفات الـ PDF (الـ CV، اللوحات، الشهادات) |
| `.pages.yml` | إعدادات لوحة التحكم (الـ forms) |
| `index.html`, `project.html`, `assets/css`, `assets/js` | التصميم والكود. **مش محتاج تعدّل فيهم.** |

---

## 1. تشوف الموقع على جهازك

دبل كليك على **`preview.cmd`**. هيفتح الموقع في المتصفح على `http://localhost:8790`، وبيقفل لما تقفل الشباك الأسود.
(لو فتحت `index.html` مباشرة هيقولك إن المحتوى مش عارف يتحمّل، لأن الموقع بيقرا الكلام من ملفات الـ `content`.)

---

## 2. النشر على GitHub Pages (مرة واحدة)

1. اعمل حساب على **github.com**. اسم المستخدم (username) هيبقى جزء من لينك الموقع، فاختاره بسيط، مثلًا `mohamed-shaltoot`.
2. من فوق على اليمين: **+** ← **New repository**.
   - Repository name: `mohamedshaltoot24.github.io` بالظبط.
   - اختار **Public** ← **Create repository**.
3. اضغط **uploading an existing file**. افتح `D:\Portfolio`، واختار كل اللي جواه بـ Ctrl+A، واسحبه على الصفحة ← **Commit changes**.
   لازم الملفين `.pages.yml` و `.nojekyll` يترفعوا هما كمان.
4. **Settings** ← **Pages** ← Source: **Deploy from a branch** ← Branch: **main** و **/(root)** ← **Save**.
5. بعد دقيقة أو اتنين الموقع هيشتغل على `https://mohamedshaltoot24.github.io`.

---

## 3. لوحة التحكم (مرة واحدة)

1. ادخل على **https://app.pagescms.org** ← **Sign in with GitHub**.
2. هيطلب منك تسطّب الـ GitHub App بتاعته: اختار **Only select repositories** وحدد الـ repository بتاع الموقع بس.
3. افتح الـ repository، وهتلاقي في الجنب:
   - **Projects**: المشاريع.
   - **Home page**: كل كلام الصفحة الرئيسية.
   - **Images** و **Documents (PDF)**: الملفات اللي رفعتها.

أي حاجة تعدّلها وتدوس **Save** بتتحفظ في GitHub، والموقع بيتحدث لوحده خلال دقيقة أو اتنين. لو ما ظهرتش، اعمل Refresh.

> Pages CMS خدمة مجانية ومفتوحة المصدر، مش تبع GitHub. بتاخد صلاحية على الـ repository اللي تختاره بس.

---

## 4. هتعمل إيه من اللوحة

| عاوز | تعمل إيه |
|---|---|
| **مشروع جديد** | Projects ← **Add an entry** آخر القايمة ← املا الخانات ← Save. الـ id لازم يبقى إنجليزي صغير من غير مسافات، مثلًا `basement-car-park` |
| **صورة الغلاف** | في المشروع ← Cover image ← ارفع الصورة |
| **صور اللوحات والـ 3D** | في المشروع ← Gallery ← Add ← ارفع الصورة واكتب caption. فعّل **Full width** للصور العريضة |
| **PDF (لوحات، حسابات، تقرير)** | في المشروع ← Documents (PDF) ← Add ← اكتب الاسم وارفع الملف. بيظهر كارت فيه زرار Open |
| **خانة جديدة في جدول المشروع** | في المشروع ← Title block ← Add ← Label و Value (مثلًا: Area / 1,200 m²) |
| **قسم كلام جديد في المشروع** | في المشروع ← Text sections ← Add ← عنوان + فقرة أو نقط |
| **لينك (شهادة على Drive، فيديو)** | في المشروع ← Links ← Add |
| **مشروع لسه شغال عليه** | Status: `in-progress` بيظهر كارت "In progress" من غير صفحة. لما يخلص غيّرها لـ `done` |
| **ترتيب المشاريع** | اسحب المشروع لفوق أو لتحت في القايمة |
| **الكلام اللي في أول الصفحة** | Home page ← Top of the page |
| **خانة جديدة جنب Discipline و Main tools** | Home page ← Top of the page ← Facts box ← Add |
| **About أو الصورة الشخصية** | Home page ← About |
| **مهارة أو برنامج جديد** | Home page ← Skills ← Skill cards أو Software chips |
| **شغلانة جديدة** | Home page ← Experience ← Work ← Add |
| **كورس أو شهادة** | Home page ← Experience ← Education and training ← Add، وارفع الشهادة PDF أو حط لينك |
| **CV جديد** | Home page ← CV (PDF) ← ارفع الملف الجديد |
| **أرقام التواصل** | Home page ← Contact |

**نصايح للصور والملفات:**

- صدّر لقطات Revit و AutoCAD بصيغة JPG أو PNG، بعرض حوالي 1600px، وخلي الصورة أقل من 500KB.
- خلي ملف الـ PDF أقل من 20MB. لو أكبر من كده، ارفعه على Google Drive وحطه في Links.
- ما تحطش لوحات من مشاريع ARBEC من غير إذن الشركة.

---

## 5. من غير اللوحة (احتياطي)

ممكن تعدّل `content/site.json` أو `content/projects.json` مباشرة على GitHub: تفتح الملف ← القلم ✏️ ← تعدّل ← Commit.
خلي بالك إن صيغة JSON حساسة: كل كلام بين `" "`، وفاصلة بين العناصر، **ومن غير فاصلة بعد آخر عنصر**.
لو الموقع ظهر فيه رسالة "The page content couldn't load" بعد تعديل يدوي، ارجع للنسخة اللي قبلها من **History**.

---

## 6. محتاج Claude في إيه

اللوحة بتغطي الكلام والصور والـ PDF والخانات. هتحتاج تعديل في الكود بس لو عاوز:

- نوع قسم جديد مش موجود (مثلًا قسم فيديوهات أو شهادات بالصور).
- تغيير في التصميم أو الألوان أو ترتيب الأقسام.

---

## 7. لسه ناقص

- **مشروع التخرج:** floor plan و section و schedule (في Gallery)، ومساحة المبنى وعدد الأدوار ونوع النظام والحمل (TR) في Title block.
- **JELECOM:** صورة غلاف ولوحات AutoCAD، والحمل والمعدات.
- **مشروع الـ Revit الكامل:** لما يخلص، غيّر Status لـ `done` واملا باقي الخانات.
