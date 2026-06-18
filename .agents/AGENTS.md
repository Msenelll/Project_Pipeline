# LUDUS MAGNUS SYSTEM PROTOCOLS - WORKFLOW QA GATE RULE

Bu proje geliştirilirken aşağıdaki kurallara her sprint geçişinde tavizsiz uyulmalıdır:

## QA SPRINT GATE PROTOKOLÜ (ZORUNLU KONTROL KAPISI)
1. **QA Ajanı Tetikleme:** Herhangi bir sprintin geliştirme aşaması tamamlandıktan sonra, bir sonraki sprinte geçmeden önce **QA Architect / QA Tester Agent** devreye alınmalı veya simüle edilmelidir.
2. **Kapsamlı Test:** QA Ajanı, mevcut sprintte teslim edilen tüm fonksiyonları, API sözleşmelerini ve performans kriterlerini test etmelidir.
3. **Resmi Onay (QA OK):** QA Ajanı testleri tamamlayıp rapor sunmadan ve açıkça **"OK" / "Onaylandı" / "Pass"** kararı vermeden sonraki sprintin planlama veya geliştirme fazına kesinlikle geçilemez.
4. **Hata Düzeltme Döngüsü:** Eğer QA Ajanı herhangi bir hata (bug) tespit ederse, geliştirme ekibi bu hataları düzeltmeli ve QA Ajanı onay verene kadar test döngüsü tekrarlanmalıdır.
5. **Tüm Sprintler İçin Geçerlilik:** Bu QA Gate süreci projedeki 1. sprintten 6. sprinte kadar tüm geliştirme döngüleri için istisnasız tekrarlanacaktır.
