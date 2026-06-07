package data

import (
	"encoding/json"
	"os"
	"sync"
)

type Country struct {
	Code      string `json:"code"`
	Name      string `json:"name"`
	NameZh    string `json:"name_zh,omitempty"`
	NameJa    string `json:"name_ja,omitempty"`
	NameDe    string `json:"name_de,omitempty"`
	NameRu    string `json:"name_ru,omitempty"`
	NameAr    string `json:"name_ar,omitempty"`
	Capital   string `json:"capital,omitempty"`
	Continent string `json:"continent,omitempty"`
	ISO       bool   `json:"iso"`
	Flag1x1   string `json:"flag_1x1,omitempty"`
	Flag4x3   string `json:"flag_4x3,omitempty"`
}

type Store struct {
	root string
	mu   sync.RWMutex
	list []Country
	byCC map[string]Country
}

func NewStore(root string) *Store {
	return &Store{root: root, byCC: make(map[string]Country)}
}

func (s *Store) Load() error {
	path := s.root + "/data/country.json"
	raw, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	var list []Country
	if err := json.Unmarshal(raw, &list); err != nil {
		return err
	}
	byCC := make(map[string]Country, len(list))
	for _, c := range list {
		byCC[c.Code] = c
	}
	s.mu.Lock()
	s.list = list
	s.byCC = byCC
	s.mu.Unlock()
	return nil
}

func (s *Store) All() []Country {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Country, len(s.list))
	copy(out, s.list)
	return out
}

func (s *Store) Get(cc string) (Country, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	c, ok := s.byCC[cc]
	return c, ok
}

func (s *Store) Related(cc string, limit int) []Country {
	s.mu.RLock()
	defer s.mu.RUnlock()
	cur, ok := s.byCC[cc]
	if !ok || cur.Continent == "" {
		return nil
	}
	var out []Country
	for _, c := range s.list {
		if c.Code == cc {
			continue
		}
		if c.Continent == cur.Continent {
			out = append(out, c)
		}
	}
	if len(out) > limit {
		out = out[:limit]
	}
	return out
}
