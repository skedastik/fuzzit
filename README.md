# fuzzit

[![Build Status][travis-image]][travis-url]

A fuzzy image fingerprinting microservice.

[travis-image]: https://travis-ci.org/skedastik/fuzzit.svg?branch=master
[travis-url]: https://travis-ci.org/skedastik/fuzzit

## Supplemental

Results of running pHash 0.9.6 against various attacks (see images in test/sample/):

```
INPUT                            HASH                  HAMMING DISTANCE

orig.jpg                         d8cd8d7de4789103      0
attacked-compressed.jpg          d8cd8d7de4789103      0
attacked-color-curved.jpg        d8cd8d7de4789103      0
attacked-grayscale.jpg           d8cd8d7de4789103      0
attacked-contrast.jpg            d8cd8d7de4789103      0
attacked-gamma.jpg               d8cd8d7de4789103      0
attacked-noise.jpg               d8cd8d7de4789103      0
attacked-gaussian-blur.jpg       d8cd8d7de4789103      0
attacked-scaled.jpg              c8cd8c7cec799506      8
attacked-new-feature.jpg         cccd8d7ce17c9103      6
attacked-padded.jpg              32208b4baf1cbdf2      32
attacked-sheared.jpg             9b99987bf02d85c2      22
attacked-crop-centered.jpg       cded25f854f20307      20
attacked-rotated.jpg             9fc94963a58d5436      28
control.jpg                      46206f9df22ed493      30
```

### Conclusions

* pHash is extremely resilient to the following attacks:
    - Compression
    - Color curving
    - Contrast/gamma adjustment
    - Noise
    - Gaussian blurring
    - Grayscale reduction
* pHash has some resilience to:
    - Small feature changes
    - Scaling
* pHash has virtually no resilience to:
    - Padding
    - Cropping
    - Shearing
    - Rotation
