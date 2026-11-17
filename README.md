# LexiMath

![LexiMath: live handwriting detection, homepage, and detected equation with symbol confidence](docs/leximath-banner.png)

A **dyslexia-friendly maths learning web app** for secondary school students, built as my final year project.
Students photograph or upload a handwritten equation, and LexiMath recognises each symbol, solves the equation,
and explains every step in simple **English or Bahasa Malaysia**.

## The problem

Students with dyslexia often find maths harder because of the reading involved: dense text, small fonts, and
explanations that skip steps. Typing an equation into a calculator app is also hard when the symbols themselves are
easy to mix up. LexiMath lets students work from their own handwriting, and explains each step slowly, in their
language, on a page they can adjust for comfortable reading.

## Features

| Area | Features | Status |
|---|---|---|
| **Recognition** | Upload a photo or use the camera · live detection · each symbol shown with its confidence | Done |
| **Solving** | Exact answer from a maths solver · step-by-step explanation in EN/BM · answer checked before it is shown | Done |
| **Visual learning** | Animations that show which term moved, combined or was divided at each step | Done |
| **Learning hub** | Form 1 Mathematics textbook · quizzes · video lessons | Done |
| **Reading comfort** | Lexend font · text size · 5 soft background themes · focus mode · reduced motion · high contrast · EN/BM switch | Done |

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (camera capture, quizzes, accessibility settings) |
| Backend | Python, Flask |
| Symbol detection | Ultralytics YOLO (custom-trained) and a classic image-processing pipeline |
| Symbol recognition | TensorFlow / Keras **CNN-ViT** model (custom-trained, 22 classes) |
| Maths solving | SymPy |
| Explanations | Claude (Anthropic API), with a built-in fallback |

**Recognised symbols:** digits `0-9`, variables `a b c x y z`, operators `+ - / =` and brackets `( )`.

## How it works

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

## Design decisions

| Decision | Why |
|---|---|
| The AI never decides the answer | SymPy computes it and Claude only explains it, so a wrong AI step can't give a student a wrong answer |
| Two detection pipelines | YOLO handles messy real-world photos; the classic pipeline needs no extra model and can be switched on with one setting |
| Accessibility first | Clear fonts, adjustable size, soft backgrounds instead of pure white, and fewer distractions, following common dyslexia-friendly guidance |

## Code samples

| File | What it shows |
|---|---|
| [`samples/preferences.js`](samples/preferences.js) | Reading-comfort settings: themes, fonts, text size, focus mode, high contrast, reduced motion and EN/BM switching, saved in the browser |
| [`samples/settings_modal.html`](samples/settings_modal.html) | The accessible settings dialog: ARIA roles, labelled controls, bilingual text |

## Source code

This is a final year project, so the full source code and trained models are kept private.
They're available on request for interviews.
