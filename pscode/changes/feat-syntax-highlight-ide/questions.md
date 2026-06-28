# Grill Me
- [x] Como configurar o realce? — Associar `*.psjava` à linguagem Java existente (reaproveita o realce Java; sem extensão/plugin próprio).
- [x] Quais SOs suportar? — Windows primeiro; macOS/Linux ficam para depois.
- [x] Doctor com realce ausente? — Reporta como aviso e mantém exit 0; só o JDK é requisito duro (exit 1).
- [x] Como detectar a IDE? — Pela pasta de config (VSCode `%APPDATA%/Code/User/`, IntelliJ `%APPDATA%/JetBrains/<Produto><versão>/`); se não achar, pergunta o caminho via CLI.
