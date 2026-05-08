package pdfdoc

import (
	"strings"
	"unicode"
)

// ToPrintableASCII maps text to WinAnsi-friendly output for core PDF fonts.
// Non-ASCII letters become '?'; other whitespace collapses to space.
func ToPrintableASCII(s string) string {
	var b strings.Builder
	for _, r := range s {
		switch {
		case r == '\n' || r == '\r' || r == '\t':
			b.WriteRune(r)
		case r >= 32 && r <= 126:
			b.WriteRune(r)
		default:
			if unicode.IsSpace(r) {
				b.WriteRune(' ')
			} else {
				b.WriteRune('?')
			}
		}
	}
	return b.String()
}
