# LexiMath

![LexiMath: live handwriting detection, homepage, and detected equation with symbol confidence](docs/leximath-banner.png)

A dyslexia-friendly maths learning web app for secondary school students, built as my final year project.
Students photograph or upload a **handwritten equation**, and LexiMath recognises each symbol, solves the equation,
and explains every step in simple **English or Bahasa Malaysia**, with animations that show how the equation changes.

> **Source code:** this is a final year project, so the full source code and trained models are kept private.
> They're available on request for interviews. This repo shows what the project does, how it's built, and two code samples.

## Features

- **Handwritten equation recognition**: upload a photo or use the camera, and each symbol is detected and classified
- **Step-by-step solutions**: every step is explained in plain language, and the final answer is checked against an exact maths solver
- **Visual step animations**: shows which term moved, combined or was divided at each step
- **Bilingual**: switch between English and Bahasa Malaysia
- **Learning hub**: Form 1 Mathematics textbook, quizzes, and video lessons
- **Reading comfort settings**: dyslexia-friendly fonts (Lexend), text size, soft background themes, focus mode, reduced motion and high contrast

## Technical Stack

### Core Frameworks
- **Flask** - Python web server and page routing
- **TensorFlow / Keras** - custom **CNN-ViT** model that classifies each handwritten symbol
- **Ultralytics YOLO** - custom-trained detector that finds each symbol in the photo
- **SymPy** - solves the equation exactly, so the answer never depends on the AI
- **Claude (Anthropic API)** - writes friendly, student-level explanations for each step
- **HTML, CSS and JavaScript** - front end with camera capture and quizzes

### Recognised Symbols
Digits `0-9`, variables `a b c x y z`, operators `+ - / =` and brackets `( )` (22 classes).

## Architecture

```
Photo or camera image
        │
        ▼
 1. Detection      YOLO finds each symbol in the image
        │          (or a classic image-processing pipeline: thresholding,
        │           merging "=" signs, splitting joined symbols)
        ▼
 2. Recognition    CNN-ViT model classifies each symbol
        │
        ▼
 3. Solving        SymPy solves the equation exactly
        │
        ▼
 4. Explanation    Claude explains each step in EN/BM. The final step is
        │          checked against SymPy's answer, with a retry if it doesn't
        │          match and a built-in fallback if the AI is unavailable
        ▼
 5. Animation      Each pair of steps is compared (moved term, combined terms,
                   scaling) and turned into an animation with EN/BM captions
```

### Design Decisions
- **The AI never decides the answer.** SymPy computes it, and Claude only explains it. If the explanation's answer doesn't match, it is retried, and if the AI is unavailable, a simpler explanation is generated without it.
- **Two detection pipelines.** YOLO handles messy real-world photos, while the classic pipeline needs no extra model and can be switched on with one setting.
- **Accessibility first.** Settings follow common dyslexia-friendly guidance: clear fonts, adjustable size, soft backgrounds instead of pure white, and fewer distractions.

## Code Samples

| File | What it shows |
|---|---|
| [`samples/preferences.js`](samples/preferences.js) | Reading-comfort settings: themes, fonts, text size, focus mode, high contrast, reduced motion and EN/BM switching, saved in the browser |
| [`samples/settings_modal.html`](samples/settings_modal.html) | The accessible settings dialog (ARIA roles, labelled controls, bilingual text) |
