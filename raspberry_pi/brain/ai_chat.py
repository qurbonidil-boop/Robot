"""Пайваст ба Claude API барои гуфтугӯи AI."""

from anthropic import Anthropic

SYSTEM_PROMPT = (
    "Ту як роботи хонагӣ ҳастӣ бо номи {name}. Ту дӯстона, кӯтоҳ ва мушаххас "
    "ҷавоб медиҳӣ (1-3 ҷумла), зеро ҷавобатро бо овоз мегӯянд. ХАМЕША бо "
    "забони тоҷикӣ (алифбои кириллӣ) ҷавоб деҳ — ҳатто агар матни корбар "
    "(масалан аз хатогии шинохти овоз) бо забони русӣ ё дигар забон омада "
    "бошад ҳам, ба тоҷикӣ тарҷума карда ҷавоб деҳ. Танҳо агар корбар "
    "мустақиман хоҳиш кунад, ки бо забони дигар гап занӣ, забонро иваз кун."
)


class AIChat:
    def __init__(self, api_key: str, robot_name: str = "Робот", model: str = "claude-sonnet-5"):
        self._client = Anthropic(api_key=api_key)
        self._model = model
        self._system_prompt = SYSTEM_PROMPT.format(name=robot_name)

    def get_response(self, user_text: str, history: list[dict]) -> str:
        messages = history + [{"role": "user", "content": user_text}]
        response = self._client.messages.create(
            model=self._model,
            max_tokens=300,
            system=self._system_prompt,
            messages=messages,
        )
        return "".join(block.text for block in response.content if block.type == "text")
