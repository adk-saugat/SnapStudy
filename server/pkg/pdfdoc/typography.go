package pdfdoc

// HeadingSizePt returns font size for ATX heading levels 1–6.
func HeadingSizePt(level int) float64 {
	sizes := map[int]float64{1: 18, 2: 15, 3: 13, 4: 12, 5: 11, 6: 11}
	if s, ok := sizes[level]; ok {
		return s
	}
	return 12
}

// HeadingLineHeight returns line height (mm) for a heading font size.
func HeadingLineHeight(sizePt float64) float64 {
	return sizePt * 0.42
}
