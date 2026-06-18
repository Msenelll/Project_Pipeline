# Unreal Engine Manuel Test Adımları (User Actions)

Aether Forge platformunun Unreal Engine entegrasyonunu ve asset içe aktarma otomasyonunu Unreal Engine Editör içinde test etmek için aşağıdaki adımları sırasıyla gerçekleştirin.

---

## Adım 1: Unreal Engine Projesinin Hazırlanması

1. Unreal Engine Editörü'nü (UE 5.0+) açın.
2. Editör ayarlarından **Python Editor Script Plugin** eklentisinin aktif olduğundan emin olun:
   * **Edit > Plugins** menüsünü açın.
   * Arama çubuğuna `Python` yazın.
   * **Python Editor Script Plugin** seçeneğini işaretleyin.
   * İstendiğinde editörü yeniden başlatın.

---

## Adım 2: Developer Settings Yapılandırması (TCP Portunun Açılması)

Python scriptlerinin dışarıdan komut alabilmesi için Unreal Engine'in TCP socket bağlantısını dinlemesi gerekmektedir.
1. **Edit > Project Settings** menüsüne gidin.
2. Sol menüden **Plugins > Python** sekmesine tıklayın.
3. **Enable Remote Execution** seçeneğini bulun ve **aktif (true)** hale getirin.
4. Varsayılan uzak bağlantı portunun `30000` olduğundan emin olun (Aether Forge varsayılan olarak bu portu dinler).

---

## Adım 3: Manuel Python Script Testi

Platform dışından, doğrudan Unreal Engine terminali veya Python konsolu üzerinden import işlemini doğrulamak için:
1. Unreal Editörü içinde alt kısımda yer alan **Output Log** sekmesini açın.
2. Sol alt köşedeki cmd/Python giriş seçeneğini **Python** olarak değiştirin.
3. Aşağıdaki komutu dosya yollarını kendinize göre güncelleyerek çalıştırın:

```python
import sys
# import-helper.py dosyasının absolute yolunu belirtin
sys.argv = ['--file', 'C:/path/to/mesh.glb', '--dest', '/Game/Characters']
exec(open('C:/repo/14_ProjectPipeline/packages/runtime/src/unreal/import-helper.py').read())
```

4. Ekranda `Successfully imported asset at: /Game/Characters/SM_Mesh` mesajını gördüğünüzde import işlemi tamamlanmış demektir.

---

## Adım 4: Platform Entegrasyonunun (E2E) Test Edilmesi

Unreal Editörünüz açık ve `Remote Execution` devredeyken, `test-unreal.ts` entegrasyon testini çalıştırın:
1. Projenin ana dizininde terminali açın.
2. Projeyi derleyin ve testi başlatın:
   ```bash
   npm run build
   node packages/runtime/dist/test-unreal.js
   ```
3. Test çıktısında `[UnrealMCPServer] Sending Python script payload to Unreal Engine TCP Port...` satırını göreceksiniz.
4. Unreal Editöründeki **Output Log** ekranında, asset'in otomatik olarak import edildiğini ve belirtilen dizine kaydedildiğini gözlemleyin.
